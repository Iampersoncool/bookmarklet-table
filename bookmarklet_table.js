if (!location.href.includes('chrome.google.com/webstore')) {
  location.href = 'https://chrome.google.com/webstore' + randomString()
  return
}

const cssText = `
tr:nth-child(even){background-color: #f2f2f2;}
tr:hover {background-color: #ddd;}
td, th {
  border: 1px solid #ddd;
  padding: 8px;
  font-family: Arial, Helvetica, sans-serif;
  border-collapse: collapse;
}
.switch {
  position: relative;
  display: inline-block;
  width: 40px;
  height: 23px;
}
.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}
.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  -webkit-transition: .4s;
  transition: .4s;
}
.slider:before {
  position: absolute;
  content: "";
  height: 17px;
  width: 17px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  -webkit-transition: .4s;
  transition: .4s;
}
input:checked + .slider {
  background-color: #2196F3;
}
input:focus + .slider {
  box-shadow: 0 0 1px #2196F3;
}
input:checked + .slider:before {
  -webkit-transform: translateX(17px);
  -ms-transform: translateX(17px);
  transform: translateX(17px);
}
/* Rounded sliders */
.slider.round {
  border-radius: 23px;
}
.slider.round:before {
  border-radius: 50%;
}
`

document.body = document.createElement('body')
document.head.innerHTML = `
<link rel="icon" href="https://ssl.gstatic.com/docs/documents/images/kix-favicon7.ico" />
<title>Google Docs</title>

<style>
${cssText}
</style>
`

document.toggleFunction = (id) => {
  const clickedRow = document.getElementById(id)
  const checked = clickedRow.querySelector('.input__box').checked

  chrome.management.setEnabled(id, checked)
}

chrome.management.getAll((extensions) => {
  const table = document.createElement('table')
  table.innerHTML += `
    <tr>
      <th></th>
      <th>Name</th>
      <th>Id</th>
      <th>Install type</th>
    </tr>
  `

  extensions.forEach((extension) => {
    const html = `
      <tr id="${extension.id}">
        <td>
          <label class="switch">
            <input type="checkbox" ${
              extension.enabled ? 'checked' : ''
            } onclick="toggleFunction('${extension.id}')" class="input__box" />
            <span class="slider round"></span>
          </label>
        </td>

        <td>${extension.name}</td>
        <td>${extension.id}</td>
        <td>${extension.installType}</td>
      </tr>
    `
    table.innerHTML += html
  })

  document.body.append(table)
})

function randomString() {
  return Math.random().toString(36).substring(2)
}
