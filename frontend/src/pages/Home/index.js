import './styles.css';
import React, { useEffect } from 'react'
import { LikeContainer } from '../../components/LikeContainer';
import { PhotoItem } from '../../components/PhotoItem';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useResetComponentMessage } from '../../hooks/useResetComponentMessage';
import { getPhotos, like } from '../../slices/photoSlice';


export const Home = () => {
  const dispatch = useDispatch();
  const resetMessage = useResetComponentMessage(dispatch);
  const { user } = useSelector((state) => state.auth);
  const { photos, loading } = useSelector((state) => state.photo);

  //load all photos
  useEffect(() => {
    dispatch(getPhotos());
    resetMessage();
  }, [dispatch])

  //Like a photo
  const handleLike = (photo) => {
    dispatch(like(photo._id));
    resetMessage();
  }

  if (loading) {
    return <p>Carregando ...</p>
  }

  return (

    <div id="home">
      {photos && photos.map((photo) => (
        <div key={photo._id}>
          <PhotoItem photo={photo} />
          <LikeContainer photo={photo} user={user} handleLike={handleLike} />
          <Link to={`/photos/${photo._id}`} className='btn'>Ver mais</Link>
          {photos && photos.length === 0 && (
            <h2 className='no-photos'>
              Ainda não há fotos publicadas, <Link to={`/users/${user.user._id}`}>Clique aqui</Link>
            </h2>
          )}
        </div>
      ))}
    </div>
  )
}
