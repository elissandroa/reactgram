import './styles.css';


//Hooks
import { useEffect, useState } from 'react';


//Components
import { Link } from 'react-router-dom';
import { Message, message } from '../../../components/Message';

//Redux
import { register, reset } from '../../../slices/authSlice';
import { useDispatch, useSelector } from 'react-redux';


export const Register = () => {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);


  const handleSubmit = (e) => {
    e.preventDefault();
    const user = {
      name,
      email,
      password,
      confirmPassword,
    }

    console.log(user);
    dispatch(register(user));
  }

  //Clean all auth states
  useEffect(() => {
    dispatch(reset());
  }, [dispatch])

  return (
    <div id='register'>
      <h2>ReactGram</h2>
      <p className="subtitle">Cadastre-se para ver as fotos dos seus amigos.</p>
      <form onSubmit={handleSubmit}>
        <input
          value={name || ""}
          onChange={(e) => setName(e.target.value)}
          type="text"
          placeholder='Nome'
        />
        <input
          value={email || ""}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder='E-mail'
        />
        <input
          value={password || ""}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder='Senha'
        />
        <input
          value={confirmPassword || ""}
          onChange={(e) => setConfirmPassword(e.target.value)}
          type="password"
          placeholder='Confirme a senha'
        />
        {
          !loading
            ? <input type="submit" value={"Cadastrar"} className='btn' />
            : <input type="submit" value={"Aguarde..."} disabled className='btn' />
        }
        {
         error && <Message msg={error} type="error"/>
        }
      </form>
      <p>
        Já tem conta ? <Link to={"/login"}>Clique aqui.</Link>
      </p>
    </div>
  )
}
