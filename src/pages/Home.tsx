import  '../styles/home.scss'
import {Button} from '../components/Button'
import { useHistory } from 'react-router'
import { FormEvent, useContext, useState } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import { database } from '../services/firebase'




export function Home(){
    const history = useHistory() 
    const {user,signInWithGoogle} = useContext(AuthContext)
    const [roomCode, setRoomCode] = useState('')
    async function handleCreateRoom(){
        if(!user){
            await signInWithGoogle()
        }

        history.push('/rooms/new')
    }

    async function handleJoinRoom(event:FormEvent){
        event.preventDefault()

        if(roomCode.trim() == ''){
            return
        }

        const roomref = await database.ref(`rooms/${roomCode}`).get()

        if(!roomref.exists()){
            alert('Room does not exists.')
            return
        }

        if(roomref.val().endedAt){
            alert('Room already closed.')
            return
        }

        history.push(`/rooms/${roomCode}`)
    }
    return(

        <div className="login">
 
            <div className="form">
            <h1 className="titulo">askroom</h1>
           <button onClick={handleCreateRoom} className="create_room">
                Crie sua sala com o Google
            </button>
            <div>ou entre em uma sala</div>
            <form onSubmit={handleJoinRoom} className="fomulario">
                <input className="input"
                    type="text"
                    placeholder="Digite o codigo da sala"
                    onChange={event=>setRoomCode(event.target.value)}
                    value={roomCode}
                /><br/>
                <Button type='submit'>
                    Entrar na sala
                </Button>
            </form>
            </div>
        </div>
    )
}