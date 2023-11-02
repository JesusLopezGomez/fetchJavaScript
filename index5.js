let list = document.getElementById("userList");
let form = document.getElementById("userForm");
let buttonAdd = document.querySelector("button[type=submit]");
const urlApi = "http://localhost:3000/users";

let users = [];

async function getUsersApi(){
    try{        
        const response = await fetch(urlApi);
        const dataUsers = await response.json();
        users = dataUsers;
        users.forEach(user => {
            addUserList(user);
        }); 
    }catch(err){
        console.log(err);
    }
}

async function addUserApi(user){
    try{
        const response = await fetch(urlApi + "?email=" + user.email);
        const dataReponse = await response.json();
        
        if(!dataReponse[0]){
            const responsePost = await fetch(urlApi,{
                method : "POST",
                body : JSON.stringify(user),
                headers : {
                    "Content-type":"application/json"
                }
            })
            if(responsePost.ok){
                const newUser = await responsePost.json();
                addUserList(newUser);
            }
        }else{
            alert("Ya existe un usuario con ese email.");
        }
    }catch(err){
        console.log(err);
    }
}

async function deleteUserApi(id,listItem){
    try{
        const response = await fetch(urlApi + "/" + id,{
            method : "DELETE",
            headers : {"Content-type":"application/json"}
        });
        if(response.ok) listItem.remove();
    }catch(err){
        console.log(err);
    }
}

async function updateUserApi(user){
    try{
        const reponseGet = await fetch(urlApi + "?email=" + user.email);
        const dataGet = await reponseGet.json();
    
        if(dataGet.some(userMail => userMail.id !== user.id)){
            alert("Ya existe un usuario con ese email");
        }else{
            const reponsePut = await fetch(urlApi + "/" + user.id,{
                method : "PUT",
                body : JSON.stringify(user),
                headers : {"Content-type":"application/json"}
            })
            if(reponsePut.ok){
                location.reload();
            }
        }
    }catch(err){
        console.log(err);
    }
    
}

getUsersApi();

buttonAdd.addEventListener("click",function(event){
    event.preventDefault();
    let name = document.getElementById("name").value;
    let address = document.getElementById("address").value;
    let email = document.getElementById("email").value;

    if(name && address && email){
        addUserApi({name,address,email});
    }
})

function addUserList(user){
    let li = document.createElement("LI");
    li.innerHTML = `${user.name}:${user.address}:${user.email}:`;
    
    let buttonDel = document.createElement("BUTTON");
    buttonDel.textContent = "Borrar";
    buttonDel.classList.add("del");
    buttonDel.setAttribute("data-id",user.id);

    let buttonMod = document.createElement("BUTTON");
    buttonMod.textContent = "Editar";
    buttonMod.classList.add("mod");
    buttonMod.setAttribute("data-id",user.id);

    li.appendChild(buttonDel);
    li.appendChild(buttonMod);
    list.appendChild(li);
}

function borrar(){
    list.addEventListener("click",function(event){
        let li = event.target.parentElement;
        let id = event.target.dataset.id;
        if(event.target.classList.contains("del")){
            deleteUserApi(id,li);
        }else if(event.target.classList.contains("mod")){
            let email = li.textContent.split(":")[2];

            users.map(user => {
                if(user.email == email){
                    document.getElementById("name").value = user.name;
                    document.getElementById("address").value = user.address;
                    document.getElementById("email").value = user.email;

                    buttonAdd.setAttribute("disabled",true);

                    let edit = document.createElement("BUTTON");
                    edit.textContent = "Editar usuario";
                    edit.setAttribute("id","edit");
                    if(document.querySelectorAll("#edit").length == 0){
                        form.appendChild(edit);
                    }
                    
                    modifyUser(user);
                }
            })
        }
    })
}

function modifyUser(user){
    document.getElementById("edit").addEventListener("click",function(event){
        event.preventDefault();
        let name = document.getElementById("name").value;
        let address = document.getElementById("address").value;
        let email = document.getElementById("email").value;
    
        if(name && address && email){
            user.name = name;
            user.address = address;
            user.email = email;
    
            updateUserApi(user);
        }
    })
}

borrar();