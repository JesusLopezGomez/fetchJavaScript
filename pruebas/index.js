const url = "http://localhost:3000/users";
const lista = document.getElementById("list");
fetch(url)
.then(respose => respose.json())
.then(data => {
    data.forEach(user => {
        const li = document.createElement("LI");
        li.innerHTML = `${user.name} : ${user.email} : ${user.addres}`;
        lista.appendChild(li);
    });
})
.catch(err => console.log(err))