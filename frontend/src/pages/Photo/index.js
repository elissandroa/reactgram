import './styles.css';
import { Link, useParams } from 'react-router-dom';
import { uploads } from '../../utils/config';
import { Message } from '../../components/Message';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { comment, getPhoto, like } from '../../slices/photoSlice';
import { PhotoItem } from '../../components/PhotoItem';
import { LikeContainer } from '../../components/LikeContainer';
import { useResetComponentMessage } from '../../hooks/useResetComponentMessage';


export const Photo = () => {

  const { id } = useParams();
  const dispatch = useDispatch();
  const resetMessage = useResetComponentMessage(dispatch);

  const { user } = useSelector((state) => state.auth);
  const { photo, loading, error, message } = useSelector((state) => state.photo);
  const [commentText, setCommentText] = useState("");


  //Load photo data
  useEffect(() => {
    dispatch(getPhoto(id));
  }, [dispatch, id])

  if (loading) {
    <p>Carregando...</p>
  }

  //Insert a like
  const handleLike = () => {
    dispatch(like(photo._id));
    resetMessage();
  }

  //Insert a comment
  const handleComment = (e) => {
    e.preventDefault();

    const commentData = {
      comment: commentText,
      id: photo._id,
    }

    dispatch(comment(commentData));

    setCommentText("");

    resetMessage();
  }

  return (

    <div id='photo'>
      <PhotoItem photo={photo} />
      <LikeContainer photo={photo} user={user} handleLike={handleLike} />
      <div className="message-container">
        {error && <Message msg={error} type='error' />}
        {message && <Message msg={message} type='success' />}
      </div>
      <div className="comments">
        {photo.comments && (
          <>
            <h3>Comentários: ({photo.comments.length})</h3>
            <form onSubmit={handleComment}>
              <input
                type="text"
                placeholder='Insira o seu comentário...'
                value={commentText || ""}
                onChange={(e) => setCommentText(e.target.value)}
                required
              />
              <input type="submit" value="Enivar" />
            </form>
            {photo.comments.length === 0 && <p>Não há comentários...</p>}
            {
              photo && photo.comments.map((comment) => (
                <div className="comment" key={comment.comment}>
                  <div className="author">
                    {comment.userImage && (
                      <img src={`${uploads}/users/${comment.userImage}`} alt={comment.userName} />
                    )}
                    <Link to={`/users/${comment.userId}`}>
                      <p>{comment.userName}</p>
                    </Link>
                  </div>
                  <p>{comment.comment}</p>
                </div>
              ))
            }
          </>
        )}
      </div>
    </div>
  )
}
