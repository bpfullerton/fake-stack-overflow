import { getMetaData } from '../../../tool';
import AnswerView from './answer';
import AnswerHeader from './header';
import { Comment } from '../../../types';
import './index.css';
import QuestionBody from './questionBody';
import VoteComponent from '../voteComponent';
import CommentSection from '../commentSection';
import useAnswerPage from '../../../hooks/useAnswerPage';

/**
 * AnswerPage component that displays the full content of a question along with its answers.
 * It also includes the functionality to vote, ask a new question, and post a new answer.
 */
const AnswerPage = () => {
  const {
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
  } = useAnswerPage();

  if (!question) {
    return null;
  }

  return (
    <>
      <VoteComponent question={question} />
      <AnswerHeader ansCount={question.answers.length} title={question.title} />
      <QuestionBody
        views={question.views.length}
        text={question.text}
        askby={question.askedBy}
        meta={getMetaData(new Date(question.askDateTime))}
      />
      <br></br>Threads:
      <div className='channelButtons'>
        {channels.map((channel, idx) => (
          <button
            key={idx}
            className='channelButton threadPreview'
            onClick={() => joinThread(channel)}>
            <span className='threadTitle'>{channel}</span>
          </button>
        ))}
      </div>
      <div className='threadCreation' id='q_thread'>
        <input
          type='text'
          className='threadNameInput'
          placeholder='Enter thread name'
          onChange={e => setNewThreadName(e.target.value)}
        />
        <button
          className='bluebtn_small createThreadButton'
          onClick={() => {
            createThread('question');
          }}>
          Create Thread
        </button>
      </div>
      <CommentSection
        comments={question.comments}
        handleAddComment={(comment: Comment) => handleNewComment(comment, 'question', questionID)}
      />
      {question.answers.map((a, idx) => (
        <AnswerView
          key={idx}
          text={a.text}
          ansBy={a.ansBy}
          meta={getMetaData(new Date(a.ansDateTime))}
          comments={a.comments}
          threads={commentThreads[idx] || []}
          createThread={createThreadWithParams}
          handleAddComment={(comment: Comment) => handleNewComment(comment, 'answer', a._id)}
          answerId={a._id!}
          joinThread={joinThread}
        />
      ))}
      <button
        className='bluebtn ansButton'
        onClick={() => {
          handleNewAnswer();
        }}>
        Answer Question
      </button>
    </>
  );
};

export default AnswerPage;
