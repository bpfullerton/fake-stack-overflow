import { useState } from 'react';
import { handleHyperlink } from '../../../../tool';
import { Comment } from '../../../../types';
import CommentSection from '../../commentSection';
import './index.css';

/**
 * Interface representing the props for the AnswerView component.
 *
 * - text The content of the answer.
 * - ansBy The username of the user who wrote the answer.
 * - meta Additional metadata related to the answer.
 * - comments An array of comments associated with the answer.
 * - threads An array of thread names associated with the answer.
 * - createThread Function to handle creating a new thread.
 * - handleAddComment Callback function to handle adding a new comment.
 * - answerId The ID of the answer.
 */
interface AnswerProps {
  text: string;
  ansBy: string;
  meta: string;
  comments: Comment[];
  threads: string[];
  createThread: (threadName: string, answerId: string, type: 'question' | 'answer') => void;
  handleAddComment: (comment: Comment) => void;
  joinThread: (threadName: string) => void;
  answerId: string;
}

/**
 * AnswerView component that displays the content of an answer with the author's name and metadata.
 * The answer text is processed to handle hyperlinks, and a comment section is included.
 *
 * @param text The content of the answer.
 * @param ansBy The username of the answer's author.
 * @param meta Additional metadata related to the answer.
 * @param comments An array of comments associated with the answer.
 * @param threads An array of thread names associated with the answer.
 * @param createThread Function to handle creating a new thread.
 * @param handleAddComment Function to handle adding a new comment.
 * @param answerId The ID of the answer.
 */
const AnswerView = ({
  text,
  ansBy,
  meta,
  comments,
  threads,
  createThread,
  handleAddComment,
  joinThread,
  answerId,
}: AnswerProps) => {
  const [newThreadName, setNewThreadName] = useState<string>('');

  return (
    <div className='answer right_padding'>
      <div className='answerContent'>
        <div id='answerText' className='answerText'>
          {handleHyperlink(text)}
        </div>
        <div className='answerAuthor'>
          <div className='answer_author'>{ansBy}</div>
          <div className='answer_question_meta'>{meta}</div>
        </div>
        <CommentSection comments={comments} handleAddComment={handleAddComment} />
      </div>
      <br></br>Threads:
      <div className='channelButtons'>
        {threads.map((thread, idx) => (
          <button
            key={idx}
            className='channelButton threadPreview'
            onClick={() => joinThread(thread)}>
            <span className='threadTitle'>{thread}</span>
          </button>
        ))}
      </div>
      <div className='threadCreation' id='a_thread'>
        <input
          type='text'
          className='threadNameInput'
          placeholder='Enter thread name'
          value={newThreadName}
          onChange={e => setNewThreadName(e.target.value)}
        />
        <button
          className='bluebtn_small createThreadButton'
          onClick={() => {
            if (newThreadName.trim() === '') {
              return;
            }
            createThread(newThreadName, answerId, 'answer');
            setNewThreadName(''); // Clear the input field after creating the thread
          }}>
          Create Thread
        </button>
      </div>
    </div>
  );
};

export default AnswerView;
