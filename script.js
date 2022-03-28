(function(){
    const todayHTML = document.querySelector('#today');
    const textHTML = document.querySelector('#text');
    const modalAdd = document.querySelector('#modalAdd');
    const modalEdit = document.querySelector('#modalEdit');
    const nameHTML = document.querySelector('#name');
    const datesUl = document.querySelector('#dates');
    const myDateHTML = document.querySelector('#myDate');
    const btnAddDate = document.querySelector('#addDate');
    const btnCloseAdd = document.querySelector('#closeAdd');
    const btnCloseEdit = document.querySelector('#closeEdit');
    const btnSend = document.querySelector('#send');
    const btnEdit = document.querySelector('#editDate');
    const btnToday = document.querySelector('#btnToday');
    const container = document.querySelector('#container');
    const upload = document.querySelector('#upload');
    const config = {
        altInput: true,
        altFormat: "d F, Y"
    }
    flatpickr("input[type=datetime-local]", config);
    /* **Inicio** Modal add/remove/edit uma data comemorativa*/
    const dates = [];
    btnAddDate.addEventListener('click', (e) =>{
        modalAdd.classList.add('show');
    });
    btnEdit.addEventListener('click', (e) =>{
        modalEdit.classList.add('show');
    });
    btnCloseAdd.addEventListener('click', (e) =>{
        modalAdd.classList.remove('show');
        modalEdit.classList.remove('show');
    });
    btnCloseEdit.addEventListener('click', (e) =>{
        modalEdit.classList.remove('show');
    });
    /* **Fim** modal add/remove adicionar uma data comemorativa*/
    const date = new Date();
    const today = {
        day: date.getDate(), 
        month: date.getMonth(), 
        year: date.getFullYear()
    };
    function todayMonth(){
        const monthTxt = ['Janeiro', 'Fevereiro','Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
        let todayMonth = monthTxt[today.month]; 
        return `${today.day} de ${todayMonth} de ${today.year}`; 
    }
    const dayToday = todayMonth();
    todayHTML.innerHTML = `<p>${dayToday}</p>`;
    btnSend.addEventListener('click', (e) =>{
        const todayIf = new Date(`${today.month +1}-${today.day}-${today.year}`);
        const myDate = new Date(myDateHTML.value);
        const todayIfInMs = todayIf.getTime();
        const myDateIfInMs = myDate.getTime();
        if(myDateIfInMs < todayIfInMs){
            alert('[ATENÇÂO] - Sua data já passou ou é hoje! Adicione uma nova data. =)');
        }else if(nameHTML.value.length === 0){
            alert('[ATENÇÂO] - Adicione uma descrição!');
        }else if(myDateHTML.value.length === 0){
            alert('[ATENÇÂO] - Adicione uma data!');
        }else if(upload.value.length === 0){
            alert('[ATENÇÂO] - Adicione uma imagem!');
        }else{
            CommeDate(nameHTML.value, myDate.getDate(), myDate.getMonth(), myDate.getFullYear());
            modalAdd.classList.remove('show');
            countAndCreateDate();
            createLine() 
            clearUp();
        }
    });
    btnToday.addEventListener('click', (e) =>{
        textHTML.innerHTML = `<h2>Hoje é:</h2>`;
        todayHTML.innerHTML = `<p>${dayToday}</p>`;
        removeImg();
    });
    function CommeDate (name, day, month, year){
        const CDate = {
            name: name, 
            day: day+1, 
            month: month+1, 
            year: year
        };
        dates.push(CDate);
        return dates;
    } 
    const seconds = 1000;
    const minutes = seconds*60;
    const hours = minutes*60;
    const days = hours*24;   

    function getBase64(element) {
         var file = element.files[0];
         return new Promise((resolve, reject) => {
             const reader = new FileReader();
             reader.readAsDataURL(file);
             reader.onload = () => resolve(reader.result);
             reader.onerror = error => reject(error);
         });
    }  
    
     
    let MS;   
    const dateInMS= [];
    async function countAndCreateDate(){
        const img = await getBase64(upload);
        const dat = getNewDate();
        for(let i in dat){
            MS = {
                name: dates[i].name,
                faltam: Math.ceil((new Date(dat[i]).getTime() - date.getTime()) / days),
                img: img
            };
        }        
        dateInMS.push(MS);   
        localStorage.setItem('dates', JSON.stringify(dateInMS))
        createLine()  
    }
    
    function dateSaved(){
        const datesString = localStorage.getItem('dates');
        const SaveDate = JSON.parse(datesString);
        console.log(SaveDate)
        return SaveDate
    }

    function createLine(){
        const SaveDate = dateSaved()
        for(let d in SaveDate){
            const li = document.createElement('li');
            const btnSelect = document.createElement('button');
            const btnDelete = document.createElement('button');
            const btnDeleteI = document.createElement('i');
            
            li.setAttribute('class', SaveDate[d].name);
            li.innerHTML = `<p> ${SaveDate[d].name}</p>`;
            datesUl.appendChild(li);
            btnSelect.setAttribute('class', `${SaveDate[d].name} btn btn-select `);
            btnDelete.setAttribute('class', `${SaveDate[d].name} btn btn-delete`);
            btnDeleteI.setAttribute('class', 'fa fa-trash');
            btnSelect.innerText = 'Selecionar';
            li.appendChild(btnSelect);
            li.appendChild(btnDelete);
            btnDelete.appendChild(btnDeleteI);
        }
    }
    createLine()
    
    const newDate = []; 
    function getNewDate (){
        let date;
        for(let d of dates){
            date = `${d.month}-${d.day}-${d.year}`;
        }
        newDate.push(date);
        return newDate;
    }    
    document.addEventListener('click', (e) =>{
        const el = e.target;
        if(el.classList.contains('btn-select')){
            const SaveDate = dateSaved()
            removeImg();
            for(let name of SaveDate){
                if(el.parentElement.className === name.name){
                    textHTML.innerHTML = `<h2>Faltam:</h2>`;
                    todayHTML.innerHTML = `<p>${name.faltam} dia(s) para: ${name.name}</p>`;
                    modalEdit.classList.remove('show');
                    const img = document.createElement('img');
                    img.setAttribute('class', 'background');
                    img.setAttribute('src', name.img);
                    container.appendChild(img) ;
                }
            }
        }
    });
    document.addEventListener('click', (e) =>{
        const el = e.target;
        if(el.classList.contains('btn-delete')){
            const SaveDate = dateSaved();
            const del = confirm('Você irá apagar esta data clicando em Ok.');
            if(del){
                for(let i in SaveDate){
                    console.log(SaveDate[i]);
                    if(el.parentElement.className === SaveDate[i].name){
                        SaveDate.splice(i, 1);
                        localStorage.setItem('dates', JSON.stringify(SaveDate));
                        console.log('apagou a data');
                    }
                }
                console.log(el.parentElement.className);
                el.parentElement.remove();
                todayHTML.innerHTML = `<p>${dayToday}</p>`;
                removeImg();
            }
        }
    });     
    function clearUp(){
        nameHTML.value = '';
        myDateHTML.value = '';
        upload.value = '';
    }
    function removeImg(){
        for(let i of container.children){
            if(i.classList.contains('background')){
                i.remove();
            }
        }
    }   
})();