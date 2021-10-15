import './RoomCode.scss'
import copyImg from '../../assets/images/copy.svg'

type RoomCodeProps={
    code:string;
}

export function RoomCode(props: RoomCodeProps){


    function copyRoomCodeToClipboard(){
        navigator.clipboard.writeText(props.code)
    }
    return(
        <button className="room-code" onClick={copyRoomCodeToClipboard}> 
            <div>
                <img src={copyImg} alt=""/>
            </div>
            <span>Sala #-MlD-EsXF2LDYDWx34gf</span>
        </button> 
    )
}