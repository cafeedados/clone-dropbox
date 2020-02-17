class DropboxController {

    constructor(){
        
        this.btnSendFileEl = document.querySelector('#btn-send-file');
        this.inputFilesEl = document.querySelector('#files'); //input files
        this.snackModalEl  = document.querySelector('#react-snackbar-root'); //modal de carregamento do arquivo
        this.progressiBarEl = this.snackModalEl.querySelector('.mc-progress-bar-fg')//barrinha
        this.namefileEl = this.snackModalEl.querySelector('.filename');//nome do arquivo na barrinha
        this.timeleftEl = this.snackModalEl.querySelector('.timeleft');//tempo restante


        this.initEvents();

    };
    //fim contructor

    initEvents(){
        this.btnSendFileEl.addEventListener('click', event =>{

            this.inputFilesEl.click();//para abrir a janela de input files

        });

        //configurar o change do inputfile
        this.inputFilesEl.addEventListener('change', event =>{
            
            this.uploadTask(event.target.files); //o evento e o change o taget e qual o alvo ou seja pegar o elemento do input e o files que sao os arquivos selecionados
            
            this.modalShow();

            this.inputFilesEl.value = '';

        });

    };//final initEvents

    modalShow(show = true){

        this.snackModalEl.style.display = (show) ? 'block' : 'none';


    };//fim modal Show




    uploadTask(files){

        let promisses = [];

        [...files].forEach(file=>{
            promisses.push(new Promise((resolve, reject)=>{
              
                let ajax = new XMLHttpRequest();

                ajax.open('POST', '/upload');

                ajax.onload = event => {

                    this.modalShow(false);

                    try{
                        resolve(JSON.parse(ajax.responseText))
                    } catch(e) {
                        reject(e);
                    };
                };

                ajax.onerror = event =>{
                    this.modalShow(false);
                    reject(event);
                };

                //para pegar em tempo real o progresso
                ajax.upload.onprogress = event => {

                    this.uploadProgress(event, file);
                    //console.log(event);
                };

                let formData = new FormData();

                formData.append('input-file', file)

                this.startUploadTime = Date.now();

                ajax.send(formData);

              }));
        });

        return Promise.all(promisses);
    }; //final upload taks

    uploadProgress(event, file){

        let timespent = Date.now() - this.startUploadTime;
        let loaded = event.loaded;
        let total = event.total;
        let porcent = parseInt((loaded / total) * 100);
        let timeleft = ((100 - porcent) * timespent) / porcent;

        this.progressiBarEl.style.width = `${porcent}%`

        this.namefileEl.innerHTML = file.name;
        this.timeleftEl.innerHTML = this.formatTimeToHuman(timeleft);

        console.log(timespent, timeleft, porcent);




    };//final upload progressive

    formatTimeToHuman(duration){

        let seconds = parseInt((duration / 1000) % 60);
        let minutes = parseInt((duration / (1000 * 60)) % 60);
        let hours = parseInt((duration / (1000 * 60 * 60)) % 24);;

        if (hours > 0){
            return `${hours} horas, ${minutes} minutos e ${seconds} segundos`;
        };

        if (minutes > 0){
            return `${minutes} minutos e ${seconds} segundos`;

        }

        if (seconds > 0){
            return `${seconds} segundos`;

        }

        return ' ';




    }//final formatTimeToHuman


}; 