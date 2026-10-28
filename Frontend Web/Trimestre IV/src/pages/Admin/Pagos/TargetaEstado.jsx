function Targetaestado({titulo, dato, texto}){
    return(
        
        <div class="targe-ren">
            <h4 class="titu-targe">{titulo}</h4>
            <div class="conte-targe">
                <span class="numero">{dato}</span>
                <p class="nombre-tar">{texto}</p>
            </div>
        </div>
    )
}

export default Targetaestado