let urlApi = "http://localhost:3000/users";
const lista = document.getElementById("userList");
const botonEnviar = document.querySelector("button[type=submit]");
let users = [];

function getUsersApi(){
    fetch(urlApi)
        .then(response => response.json())
        .then(dataUsers => {
            users = dataUsers;
            users.forEach(user => {
                mostrarListaHtml(user);
            });
        })
        .catch(err => {
            console.log('Error en la petición HTTP: '+err.message);
        });
}

function deleteUsersApi(id,listItem){
    fetch(urlApi + "/" + id,{
        method : "DELETE",
        headers : {
            "Content-type":"application/json"
        }
    })
        .then(response => {
            if(response.ok){
                listItem.remove();
            }})
        .catch(err => {
            console.log('Error en la petición HTTP: '+err.message);
        });
}

function addUserApi(user){
    fetch(urlApi,{
        method : "POST",
        body : JSON.stringify(user),
        headers : {
            "Content-type":"application/json"
        }
    })
        .then(response => {
            if(response.ok){
                mostrarListaHtml(user);
            }})
        .catch(err => {
            console.log('Error en la petición HTTP: '+err.message);
        });
}

function modifyUser(user){
    /*Miro si hay algun email con el email del usuario en el caso de que haya usuario con ese mail, 
    compruebo que el usuario que tiene ese mail es diferente al usuario que le paso, comparando por la id y en el caso de que 
    sea diferente la id del usuario introducida y la id del usuario que he obtenido del get no se puede modificar el mail porque otro usuario ya tiene ese mail
    y en caso contrario si puedo modificar el mail*/
    fetch(urlApi + "?email=" + user.email)
    .then(response => response.json())
    .then(usersPeticion => {
        usersPeticion.forEach(userP => {
            if(userP.id !== user.id){
                alert("Ese mail ya existe");
            }else{
                fetch(urlApi + "/" + user.id,{
                    method : "PUT",
                    body : JSON.stringify(user),
                    headers : {
                        "Content-type":"application/json"
                    }
                })
                .then(response => {
                    if(response.ok){
                        location.reload();
                    }
                })
                    .catch(err => {
                        console.log('Error en la petición HTTP: '+err.message);
                    }); 
            }
        })
    })

}

getUsersApi();

botonEnviar.addEventListener("click",function(event){
    let name = document.getElementById("name").value;
    let address = document.getElementById("address").value;
    let email = document.getElementById("email").value;

    if(name && address && email){
        addUserApi({name,address,email});
    }
})

function mostrarListaHtml(user){
    let li = document.createElement("LI");
    
    let buttonDel = document.createElement("BUTTON");
    buttonDel.textContent = "Borrar";
    buttonDel.classList.add("del");
    buttonDel.setAttribute("data-id",user.id);

    let buttonEdit = document.createElement("BUTTON");
    buttonEdit.textContent = "Editar";
    buttonEdit.classList.add("mod");
    buttonEdit.setAttribute("data-id",user.id);

    li.innerHTML = `${user.name}:${user.address}:${user.email}:`;
    
    li.appendChild(buttonEdit);
    li.appendChild(buttonDel);
    lista.appendChild(li);
}

lista.addEventListener("click",function(event){
    const li = event.target.parentElement;
    if(event.target.classList.contains("del")){
        deleteUsersApi(li.getElementsByClassName("del")[0].dataset.id,li);
    }

    if(event.target.classList.contains("mod")){
        let datosLi = li.textContent.split(":");
        let email = datosLi[2];
        users.map(user => {
            if(email == user.email){
                document.getElementById("name").value = user.name;
                document.getElementById("address").value = user.address;
                document.getElementById("email").value = user.email;
        
                botonEnviar.setAttribute("disabled","true");
        
                let botonEditar = document.createElement("BUTTON");
                botonEditar.textContent = "Editar usuario";
                botonEditar.setAttribute("id","editar");

                if(document.querySelectorAll("#editar").length < 1){
                    document.getElementById("userForm").appendChild(botonEditar);
                }
                modificar(user);
            }
        })
        
    }
})


function modificar(user){
    document.getElementById("editar").addEventListener("click",function(event){
        event.preventDefault();
        let name = document.getElementById("name").value;
        let address = document.getElementById("address").value;
        let email = document.getElementById("email").value;    
        
        if(name && address && email){
            user.name = name;
            user.address = address;
            user.email = email;

            modifyUser(user);
        }
    })
}
