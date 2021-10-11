import '../styles/home.scss'
import {Button} from '../components/Button'
import { FormEvent, useContext, useState } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import { Link, useHistory } from 'react-router-dom'
import { database } from '../services/firebase'





export function NewRoom(){

    const {user} = useContext(AuthContext)
    const history = useHistory()
    const [newRoom, setNewRoom] = useState('')


    async function handleCreateRoom(event:FormEvent){
        event.preventDefault()

        if(newRoom.trim() == ''){
            return
        }

        const roomref = database.ref('rooms')


        const firebaseRoom = await roomref.push({
            title: newRoom,
            authorId: user?.id,
        })

        history.push(`/admin/rooms/${firebaseRoom.key}`)



    }
    return(
        <div className="login">
            <div className="form">

            <h1 className="titulo">Criar nova sala</h1>
            
            <form onSubmit={handleCreateRoom} className="fomulario">
                <input className="input"
                    type="text"
                    placeholder="Nome da sala"
                    onChange={event=>setNewRoom(event.target.value )}
                    value={newRoom}
                /><br/>
                <Button type='submit'>
                    Criar sala
                </Button>
                
                <p>Quer entrar em uma sala existente?<Link to="/">clique aqui</Link></p>
            </form>
            </div>
        </div>
    )
}