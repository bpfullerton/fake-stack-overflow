import { useNavigate, useParams } from 'react-router-dom';
import { StreamChat } from 'stream-chat';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Comment, Answer, Question, VoteData } from '../types';
import useUserContext from './useUserContext';
import addComment from '../services/commentService';
import { getQuestionById, createNewQuestionThread } from '../services/questionService';
import { createNewAnswerThread } from '../services/answerService';
import { userLogin } from '../services/userService';

/**
 * Custom hook for managing the answer page's state, navigation, and real-time updates.
 *
 * @returns questionID - The current question ID retrieved from the URL parameters.
 * @returns question - The current question object with its answers, comments, and votes.
 * @returns handleNewComment - Function to handle the submission of a new comment to a question or answer.
 * @returns handleNewAnswer - Function to navigate to the "New Answer" page
 */
const useAnswerPage = () => {
  const { qid } = useParams();
  const navigate = useNavigate();

  const { user, socket } = useUserContext();
  const [questionID, setQuestionID] = useState<string>(qid || '');
  const [question, setQuestion] = useState<Question | null>(null);
  const [newThreadName, setNewThreadName] = useState<string>('');
  const [channels, setChannels] = useState<string[]>([]);
  const channelsFetched = useRef(false); // To track if channels have been fetched
  const [commentThreads, setCommentThreads] = useState<string[][]>([]);

  const getChannels = useCallback(async (): Promise<void> => {
    const client = StreamChat.getInstance('eb4nygr27qx2');

    if (!client.userID) {
      const token = await userLogin(user.username);
      await client.connectUser({ id: user.username, name: user.username }, token);
    }

    if (!question || !question.threads || question.threads.length === 0) {
      setChannels([]);
      setCommentThreads([]);
      return;
    }

    // Query channels by their IDs
    const lchannels = await client.queryChannels({ id: { $in: question!.threads } });

    const names = lchannels.map(channel => channel.data?.name ?? '');
    // Set the channel names to the state
    setChannels(names);

    // Fetch channels for each answer
    const answerChannelPromises = question.answers
      .filter(answer => answer.threads && answer.threads.length > 0)
      .map(answer => client.queryChannels({ id: { $in: answer.threads } }));

    const answerChannels = await Promise.all(answerChannelPromises);
    const answerChannelNames = answerChannels.map(channelsAns =>
      channelsAns.map(channel => channel.data?.name ?? ''),
    );
    // Set the answer channel names to the state
    setCommentThreads(answerChannelNames);
  }, [question, user.username]);

  useEffect(() => {
    if (question && !channelsFetched.current) {
      getChannels();
      channelsFetched.current = true; // Set to true to avoid fetching again
    }
  }, [getChannels, question]); // Only run this effect when `question` changes

  /**
   * Function to handle navigation to the "New Answer" page.
   */
  const handleNewAnswer = () => {
    navigate(`/new/answer/${questionID}`);
  };

  useEffect(() => {
    if (!qid) {
      navigate('/home');
      return;
    }

    setQuestionID(qid);
  }, [qid, navigate]);

  /**
   * Function to handle the submission of a new comment to a question or answer.
   *
   * @param comment - The comment object to be added.
   * @param targetType - The type of target being commented on, either 'question' or 'answer'.
   * @param targetId - The ID of the target being commented on.
   */
  const handleNewComment = async (
    comment: Comment,
    targetType: 'question' | 'answer',
    targetId: string | undefined,
  ) => {
    try {
      if (targetId === undefined) {
        throw new Error('No target ID provided.');
      }

      await addComment(targetId, targetType, comment);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error adding comment:', error);
    }
  };

  useEffect(() => {
    /**
     * Function to fetch the question data based on the question ID.
     */
    const fetchData = async () => {
      try {
        const res = await getQuestionById(questionID, user.username);
        setQuestion(res || null);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error fetching question:', error);
      }
    };

    // eslint-disable-next-line no-console
    fetchData().catch(e => console.log(e));
  }, [questionID, user.username]);

  useEffect(() => {
    /**
     * Function to handle updates to the answers of a question.
     *
     * @param answer - The updated answer object.
     */
    const handleAnswerUpdate = ({ qid: id, answer }: { qid: string; answer: Answer }) => {
      if (id === questionID) {
        setQuestion(prevQuestion =>
          prevQuestion
            ? // Creates a new Question object with the new answer appended to the end
              { ...prevQuestion, answers: [...prevQuestion.answers, answer] }
            : prevQuestion,
        );
      }
    };

    /**
     * Function to handle updates to the comments of a question or answer.
     *
     * @param result - The updated question or answer object.
     * @param type - The type of the object being updated, either 'question' or 'answer'.
     */
    const handleCommentUpdate = ({
      result,
      type,
    }: {
      result: Question | Answer;
      type: 'question' | 'answer';
    }) => {
      if (type === 'question') {
        const questionResult = result as Question;

        if (questionResult._id === questionID) {
          setQuestion(questionResult);
        }
      } else if (type === 'answer') {
        setQuestion(prevQuestion =>
          prevQuestion
            ? // Updates answers with a matching object ID, and creates a new Question object
              {
                ...prevQuestion,
                answers: prevQuestion.answers.map(a =>
                  a._id === result._id ? (result as Answer) : a,
                ),
              }
            : prevQuestion,
        );
      }
    };

    /**
     * Function to handle updates to the views of a question.
     *
     * @param q The updated question object.
     */
    const handleViewsUpdate = (q: Question) => {
      if (q._id === questionID) {
        setQuestion(q);
      }
    };

    /**
     * Function to handle vote updates for a question.
     *
     * @param voteData - The updated vote data for a question
     */
    const handleVoteUpdate = (voteData: VoteData) => {
      if (voteData.qid === questionID) {
        setQuestion(prevQuestion =>
          prevQuestion
            ? {
                ...prevQuestion,
                upVotes: [...voteData.upVotes],
                downVotes: [...voteData.downVotes],
              }
            : prevQuestion,
        );
      }
    };

    socket.on('answerUpdate', handleAnswerUpdate);
    socket.on('viewsUpdate', handleViewsUpdate);
    socket.on('commentUpdate', handleCommentUpdate);
    socket.on('voteUpdate', handleVoteUpdate);

    return () => {
      socket.off('answerUpdate', handleAnswerUpdate);
      socket.off('viewsUpdate', handleViewsUpdate);
      socket.off('commentUpdate', handleCommentUpdate);
      socket.off('voteUpdate', handleVoteUpdate);
    };
  }, [questionID, socket]);

  const createThreadWithParams = async (
    threadName: string,
    aid: string,
    type: 'question' | 'answer',
  ): Promise<string> => {
    const client = StreamChat.getInstance('eb4nygr27qx2');
    if (!client.userID) {
      if (!client.userID) {
        const token = await userLogin(user.username);
        await client.connectUser({ id: user.username, name: user.username }, token);
      }
    }

    if (!threadName) {
      throw new Error('Thread name is empty');
    }
    if (threadName.length < 3) {
      throw new Error('Thread name is too short');
    }

    const sanitize = (text: string) => text.replace(/[^a-zA-Z]/g, '');
    const sanitizedThreadName = sanitize(threadName);
    const truncatedThreadName = sanitizedThreadName.substring(0, 40);

    const randomNumber = Math.floor(Math.random() * 1001);
    const channelId = `${truncatedThreadName}${randomNumber}`;

    const channel = client.channel('messaging', `${channelId}`, {
      name: threadName,
      members: ['hypo', user.username],
      is_private: false,
    });

    await channel.create();
    if (!channel.id) {
      throw new Error('Channel ID is null');
    }
    if (type === 'question') {
      createNewQuestionThread(questionID, channel.id);
    } else {
      createNewAnswerThread(aid, channel.id);
    }

    // Navigate to the messages page
    navigate(`/messages/`);
    return channel.id;
  };

  const createThread = async (type: 'question' | 'answer'): Promise<string> => {
    const client = StreamChat.getInstance('eb4nygr27qx2');
    if (!client.userID) {
      const token = await userLogin(user.username);
      await client.connectUser({ id: user.username, name: user.username }, token);
    }

    if (!newThreadName) {
      throw new Error('Thread name is empty');
    }
    if (newThreadName.length < 3) {
      throw new Error('Thread name is too short');
    }

    // Check for duplicate thread names within the current question
    const existingThreadNames = channels.concat(...commentThreads);
    if (existingThreadNames.includes(newThreadName)) {
      throw new Error('Thread name already exists in this question');
    }

    const sanitize = (text: string) => text.replace(/[^a-zA-Z]/g, '');
    const sanitizedThreadName = sanitize(newThreadName);
    const truncatedThreadName = sanitizedThreadName.substring(0, 40);

    const randomNumber = Math.floor(Math.random() * 1001);
    const channelId = `${truncatedThreadName}${randomNumber}`;

    const channel = client.channel('messaging', `${channelId}`, {
      name: newThreadName,
      members: ['hypo', user.username],
      is_private: false,
    });

    await channel.create();
    if (!channel.id) {
      throw new Error('Channel ID is null');
    }
    if (type === 'question') {
      createNewQuestionThread(questionID, channel.id);
    } else {
      createNewAnswerThread(questionID, channel.id);
    }
    // Navigate to the messages page
    navigate(`/messages/`);
    return channel.id;
  };

  const joinThread = async (title: string) => {
    const client = StreamChat.getInstance('eb4nygr27qx2');
    const t = await client.queryChannels({ name: title });
    if (t.length === 0) {
      return;
    }
    const tId = t[0].id;

    if (!client.userID) {
      const token = await userLogin(user.username);
      await client.connectUser({ id: user.username, name: user.username }, token);
    }

    const channel = client.channel('messaging', tId);
    await channel.watch();
    await channel.addMembers([user.username]);
    navigate(`/messages/`);
  };

  return {
    questionID,
    question,
    channels,
    commentThreads,
    handleNewComment,
    handleNewAnswer,
    createThread,
    setNewThreadName,
    createThreadWithParams,
    joinThread,
  };
};

export default useAnswerPage;
