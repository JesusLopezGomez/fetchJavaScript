let form = document.getElementById("userForm");
let list = document.getElementById("userList");
let buttonAdd = document.querySelector("button[type=submit]");
let usersData = [];
const url = "http://localhost:3000/users";

async function getUsersApi() {
    try {
        const response = await fetch(url);
        const usersDataResponse = await response.json();
        usersData = usersDataResponse;
        usersData.forEach(user => {
            addUserList(user);
        });
    } catch (err) {
        console.log(err);
    }
}

async function addUserApi(user) {
    try {
        const responseEmail = await fetch(url + "?email=" + user.email);
        const dataMail = await responseEmail.json();

        if (!dataMail[0]) {
            const postUser = await fetch(url, {
                method: "POST",
                body: JSON.stringify(user),
                headers: {
                    "Content-type": "application/json"
                }
            })

            if (postUser.ok) {
                const newUser = await postUser.json();
                addUserList(newUser);
                form.reset();
            }
        } else {
            alert("Ya existe un usuario con ese mail");
        }
    } catch (err) {
        console.log(err);
    }
}

async function deleteUserApi(id, li) {
    try {
        const response = await fetch(url + "/" + id, {
            method: "DELETE",
            headers: {
                "Content-type": "application/json"
            }
        })
        if (response.ok) {
            li.remove();
        }
    } catch (err) {
        console.log(err);
    }
}

async function updateUserApi(user) {
    try {
        const responseMail = await fetch(url + "?email=" + user.email);
        const dataMail = await responseMail.json();
        if (dataMail.some(userMail => userMail.id !== user.id)) {

            alert("Ya hay un usuario con ese mail");
            form.reset();

        } else {

            const responsePut = await fetch(url + "/" + user.id, {
                method: "PUT",
                body: JSON.stringify(user),
                headers: {
                    "Content-type": "application/json"
                }
            })

            if(responsePut.ok){
                location.reload();
            }

        }
    } catch (err) {
        console.log(err);
    }
}

buttonAdd.addEventListener("click", function (event) {
    event.preventDefault();
    let name = document.getElementById("name").value;
    let address = document.getElementById("address").value;
    let email = document.getElementById("email").value;

    if (name && address && email) {
        addUserApi({ name, address, email });
    }
})

function addUserList(user) {
    let li = document.createElement("LI");

    let buttonDel = document.createElement("BUTTON");
    let buttonMod = document.createElement("BUTTON");

    buttonDel.setAttribute("data-id", user.id);
    buttonMod.setAttribute("data-id", user.id);

    buttonDel.classList.add("del");
    buttonMod.classList.add("mod");

    buttonDel.textContent = "Borrar";
    buttonMod.textContent = "Editar";

    li.innerHTML = `${user.name}:${user.address}:${user.email}:`;
    li.appendChild(buttonDel);
    li.appendChild(buttonMod);
    list.appendChild(li);
}

list.addEventListener("click", function (event) {
    let li = event.target.parentElement;
    if (event.target.classList.contains("del")) {
        deleteUserApi(event.target.dataset.id, li);
    } else if (event.target.classList.contains("mod")) {
        let infoUser = li.textContent.split(":");
        let mail = infoUser[2];

        usersData.map(user => {
            if (mail == user.email) {
                document.getElementById("name").value = user.name;
                document.getElementById("address").value = user.address;
                document.getElementById("email").value = user.email;

                buttonAdd.setAttribute("disabled", "true");

                let buttonEdit = document.createElement("BUTTON");
                buttonEdit.textContent = "Editar Usuario";
                buttonEdit.setAttribute("id", "edit");

                if (document.querySelectorAll("#edit").length < 1) {
                    form.appendChild(buttonEdit);
                }

                modifyUser(user);
            }
        })

    }
})

function modifyUser(user) {
    document.getElementById("edit").addEventListener("click", function (event) {
        event.preventDefault();
        let name = document.getElementById("name").value;
        let address = document.getElementById("address").value;
        let email = document.getElementById("email").value;

        if (name && address && email) {
            user.name = name;
            user.address = address;
            user.email = email;

            updateUserApi(user);
            form.reset();
        }
    });
}

getUsersApi();