import { Button } from "../../components/button/Button";
import { RoomCode } from "../../components/RoomCode/RoomCode";
import './room.scss'
import { Link, useHistory, useParams } from "react-router-dom";
import { Question } from "../../components/Question/Questions";
import { useRoom } from "../../hooks/useRoom";
import { database } from "../../services/firebase";

import ImgDelete from '../../assets/images/delete.svg'
import CheckImg from '../../assets/images/check.svg'
import AnswerImg from '../../assets/images/answer.svg'
import { Fragment } from "react";



type RoomParams={
    id: string;
}


export default function AdminRoom(){
    const history = useHistory()
    const params = useParams<RoomParams>()
    const roomId = params.id

    const {title, questions} = useRoom(roomId)

    async function handleEndRoom() {
        await  database.ref(`rooms/${roomId}`).update({
            endedAt: new Date()
        })

        history.push('/')
    }

    async function handleDeleteQuestion(questionId : string){
        if (window.confirm('Voce deseja excluir essa pergunta?')){
            await database.ref(`rooms/${roomId}/questions/${questionId}`).remove()
        }

    }
    async function handleCheckQuestion(questionId : string){
        
            await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
                isAnswered:true,
            })
        

    }
    async function handleHighLightQuestion(questionId : string){
     
            await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
                isHighlighted:true,
            })
      

    }
    
    
    
    return(
        <div id="page-room">
            <header>
                <div className="content">
                <h1><Link style={{ color: 'inherit' ,textDecoration:'none'}}to="/">askroom</Link></h1>
                    <img src="" alt="" />

                    <div>
                        <RoomCode code={roomId}/>  
                        <Button isOutlined onClick={handleEndRoom}>Encerrar Sala</Button>
                    </div>              
                </div>
            </header>
            <main >
                <div className="room-title">
                    <h1>SALA : {title} </h1>
                  
                    {questions.length <= 0 && <span> 0 pergunta(s)</span> }
                    { questions.length > 0 && <span>{questions.length} pergunta(s)</span> }
                               
                </div>
               
                <div className="div question-list">
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
                                    <>
                                    <button
                                    type="button"
                                    onClick={() => handleCheckQuestion(question.id)}
                                    >
                                        <img src={CheckImg} alt="marcar pergunta como respondidad" />
    
                                    </button>
                                    <button
                                    type="button"
                                    onClick={() => handleHighLightQuestion(question.id)}
                                    >
                                        <img src={AnswerImg} alt="dar destaque a pergunta" />
    
                                    </button>
                                    </> 
                                )}
                                
                                <button
                                type="button"
                                onClick={() => handleDeleteQuestion(question.id)}
                                >
                                    <img src={ImgDelete} alt="remover pergunta" />

                                </button>

                            </Question>
                        )
                    })}
                </div>
               
            </main>
        </div>
    )
}