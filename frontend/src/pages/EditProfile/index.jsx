import './styles.css';


import { uploads } from '../../utils/config';

//Hooks
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

//Redux
import { profile, resetMessage, updateProfile } from '../../slices/userSlice';
import { Message } from '../../components/Message';



export const EditProfile = () => {

  const dispatch = useDispatch();

  const { user, message, loading, error } = useSelector((state) => state.user);

  //States
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [bio, setBio] = useState("");
  const [previewImage, setPreviewImage] = useState("");



  //Load user data
  useEffect(() => {
    dispatch(profile());
  }, [dispatch]);

  //Fill form with user data

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setBio(user.bio);
    }
  }, [user])


  const handleSubmit = async (e) => {
    e.preventDefault();

    //Gather user data from states
    const userData = {
      name,

    }

    if (profileImage) {
      userData.profileImage = profileImage;
    }

    if (bio) {
      userData.bio = bio;
    }

    if (password) {
      userData.password = password;
    }

    //Build form data
    const formData = new FormData();
    const userFormData = Object.keys(userData).forEach((key) => formData.append(key, userData[key]));
    formData.append("user", userFormData);
    await dispatch(updateProfile(formData));

    setTimeout(() => {
      dispatch(resetMessage());
    }, [2000])
  }

  const handleFile = (e) => {
    //Image preview
    const image = e.target.files[0];
    setPreviewImage(image);

    //Update image state 
    setProfileImage(image);

  }


  return (
    <div id='edit-profile'>
      <h2>Edit seus dados</h2>
      <p className="subtitle">
        Adicione uma imagem de perfil e conte mais sobre você...
      </p>
      {
        (user.profileImage || previewImage) && (
          <img className='profile-image' src={
            previewImage
              ? URL.createObjectURL(previewImage)
              : `${uploads}/users/${user.profileImage}`
          }
            alt={user.name} />
        )
      }

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nome"
          value={name || ''}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="E-mail"
          disabled
          value={email || ''}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label>
          <span>Imagem do perfil:</span>
          <input type="file"
            onChange={handleFile}
          />
        </label>
        <label>
          <span>Bio:</span>
          <input
            type="text"
            placeholder="Descrição do perfil"
            value={bio || ''}
            onChange={(e) => setBio(e.target.value)}
          />
        </label>
        <label>
          <span>Quer alterar sua senha?</span>
          <input
            type="password"
            placeholder="Digite sua nova senha"
            value={password || ''}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        {
          !loading
            ? <input type="submit" value={"Atualizar"} className='btn' />
            : <input type="submit" value={"Aguarde..."} disabled className='btn' />
        }
        {
          message 
          ? <Message msg={message} type="success" />
          : <Message msg={error} type="error" />
        }
      </form>
    </div>
  )
}