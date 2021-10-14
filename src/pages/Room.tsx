import { Button } from "../components/Button";
import { RoomCode } from "../components/RoomCode";
import '../styles/room.scss'
import { useHistory, useParams } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { FormEvent, useContext, useState } from "react";
import { database } from "../services/firebase";
import { Question } from "../components/Questions";
import { useRoom } from "../hooks/useRoom";
import {Link} from 'react-router-dom'

type RoomParams={
    id: string;
}


export default function Room(){

    const {user} = useContext(AuthContext)
    const params = useParams<RoomParams>()
    const [newQuestion, setNewQuestion] = useState('')
    const roomId = params.id
    const {title,questions} = useRoom(roomId)

    
    
    
    async function handleSendQuestion(event: FormEvent){
       
        event.preventDefault()
        if(newQuestion.trim() == ''){
            return
        }

        if(!user){
            throw new Error('You must be logged in')
        }

        const question = {
            content:newQuestion,
            author:{
                name:user?.name,
                avatar:user.avatar,

            },
            isHighlighted:false,
            isAnswered:false
        }

        await database.ref(`rooms/${roomId}/questions`).push(question)

        setNewQuestion('')
    }

    async function handleLikeQuestion(questionId :string, likeId:string | undefined) {
        if(likeId){
            await database.ref(`rooms/${roomId}/questions/${questionId}/likes/${likeId}`).remove()
        }else{
            await database.ref(`rooms/${roomId}/questions/${questionId}/likes`).push({
                authorId:user?.id,
            })
        }

    }


    return(
        <div id="page-room">
            <header>
                <div className="content">
                    <h1><Link style={{ color: 'inherit' ,textDecoration:'none'}}to="/">askroom</Link></h1>
                  
                    <RoomCode code={roomId}/>                   
                </div>
            </header>
            <main >
                <div className="room-title">
                    <h1>SALA : {title} </h1>
                    {questions.length <= 0 && <span> 0 pergunta(s)</span> }
                    {questions.length > 0 && <span>{questions.length} pergunta(s)</span> }
                 
                  
                               
                </div>
                <form onSubmit={handleSendQuestion}>
                    <textarea 
                    placeholder="oq vc quer perguntar?"
                    onChange={event=>setNewQuestion(event.target.value)}
                    value={newQuestion}
                    />

                    <div className="form-footer">
                        { user? 
                        (<div className="user-info">
                            <img src={user.avatar} alt={user.name} />
                            <span>{user.name}</span>

                        </div>) 
                        : 
                        ( <span>para enviar uma pergunta,<button>faça seu login</button></span>) }
                        
                        <Button type="submit" disabled={!user}>Enviar Pergunta</Button>
                    </div>
                </form>
                <div className="question-list">
                        {questions.map(question => {
                        return(
                            <Question
                                key={question.id}
                                content={question.content}
                                author={question.author}
                                isAnswered={question.isAnswered}
                                isHighlighted={question.isHighlighted}
                            >
                                {!question.isAnswered && (
                                    <button
                                    className={`like-button ${question.likeId ? 'liked' : ''}`}
                                    type="button"
                                    aria-label="Marcar como gostei" 
                                    onClick={() => handleLikeQuestion(question.id, question.likeId)} 
                                  > 
                                      <div>
                                      {question.likeCount > 0 && <span>{question.likeCount}</span>}
                                      <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#737380" strokeWidth="1.5" ><path d="M0 0h24v24H0V0zm0 0h24v24H0V0z" fill="none"/><path    d="M9 21h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.58 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2zM9 9l4.34-4.34L12 10h9v2l-3 7H9V9zM1 9h4v12H1z"/></svg>
                                  
                                  </div>
                                  </button>
                                ) }
                                
                            </Question>
                            
                         
                        )
                    })}
                </div>
               
            </main>
        </div>
    )
}