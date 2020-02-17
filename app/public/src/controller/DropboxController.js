class DropboxController {

    constructor(){
        
        this.btnSendFileEl = document.querySelector('#btn-send-file');
        this.inputFilesEl = document.querySelector('#files'); //input files
        this.snackModalEl  = document.querySelector('#react-snackbar-root'); //modal de carregamento do arquivo
        
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
            
            
            this.snackModalEl.style.display = 'block';
        });

    };//final initEvents

    uploadTask(files){

        let promisses = [];

        [...files].forEach(file=>{
            promisses.push(new Promise((resolve, reject)=>{
              
                let ajax = new XMLHttpRequest();

                ajax.open('POST', '/upload');

                ajax.onload = event => {
                    try{
                        resolve(JSON.parse(ajax.responseText))
                    } catch(e) {
                        reject(e);
                    };
                };

                ajax.onerror = event =>{
                    reject(event);
                };

                let formData = new FormData();

                formData.append('input-file', file)
                ajax.send(formData);

              }));
        });

        return Promise.all(promisses);
    }; //final upload tak
}; 