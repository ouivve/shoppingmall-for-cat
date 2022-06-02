function prepareModal() {
  $(document).ready(function () {
    // Activate tooltip
    $('[data-toggle="tooltip"]').tooltip();

    // Select/Deselect checkboxes
    var checkbox = $('table tbody input[type="checkbox"]');
    $("#selectAll").click(function () {
      if (this.checked) {
        checkbox.each(function () {
          this.checked = true;
        });
      } else {
        checkbox.each(function () {
          this.checked = false;
        });
      }
    });
    checkbox.click(function () {
      if (!this.checked) {
        $("#selectAll").prop("checked", false);
      }
    });
  });
}

import * as Api from "/api.js";
import { randomId } from "/useful-functions.js";

class CreateTableHelper{
  currentId ='';
  constructor(name){
    this.name = name;
  }

  static createMenu(sysCodes){
    function createButtons(sysCodeData){
      function createButton(_id, name){
      return `
      <button class="button m-1" data-id="${_id}" data-name="${name}">
        ${name}
      </button>
      `
      }
      return sysCodeData.map(({_id, name})=> createButton(_id, name)).join('');
    }
    return createButtons(sysCodes);
  }

  async createTable(tbHead, tbBody, mdEdit, mdAdd, mdDel){
    const data = await translateSysCodeToApi(this.name,"all")();
    console.log('createTable',data);

    tbHead.innerHTML = this.createHtmlHelper('HEAD')(data);
    tbBody.innerHTML = this.createHtmlHelper('BODY')(data);

    tbBody.querySelectorAll('a').forEach(e=>
    e.addEventListener('click',async(e)=>{
      this.currentId = e.target.dataset.id;
      
      console.log(e.target.dataset.do);
      if(e.target.dataset.do == 'Edit'){
        const {name, desc} = await translateSysCodeToApi(
          this.name,
          "search"
        )(this.currentId);
        /**
         * Tags Pattern
         * "Edit_${attr}
         */
        const key = Object.keys(desc?{name, desc}:{name});
        const value = Object.values(desc?{name, desc}:{name});
        for(let i = 0; i < key.length; i++){
          document.getElementById(`Edit_${key[i]}`).value = value[i];
        }
        console.log(info);
      }
    }));
    mdEdit.innerHTML = this.createHtmlHelper("EDIT")(data);
    mdAdd.innerHTML = this.createHtmlHelper("ADD")(data);
    mdAdd.parentElement.querySelector('#EditSubmitButton')
      .addEventListener('click', (e)=>{
        e.preventDefault();
          const {name, desc}=data[0];
          const key = Object.keys(desc?{name, desc}:{name});
          const result = key.map(key => document.getElementById(`Add_${key}`).value);
          console.log(result);
        
      })
    mdDel.parentElement
      .querySelector(".md-ok")
      .addEventListener("click", async(e) => {
        e.preventDefault();
        console.log('삭제중');
        // const result = await translateSysCodeToApi(this.name,'','');
      });
  };

  // setElementName(...labelElement){
  //   [...labelElement].forEach((e) => (
  //     e.textContent = `${e.textContent??''} ${this.name}`
  //     ));
  // }



  createHtmlHelper(Type){
    console.log('execute HTMLHelper', Type);
    switch(Type){
      case 'HEAD':return function(keys) {
        keys = Object.keys(keys[0]);
        let head = 
        `
        <th>
          <span class="custom-checkbox">
              <input type="checkbox" id="selectAll">
              <label for="selectAll"></label>
          </span>
        </th>
        `
        keys.forEach(keys => head += `<th>${keys}</th>`)
        return head;
      }
      case 'BODY':return function(data){
        function createTableRow(value) {
          value = Object.values(value);
          function createTabLeData(value){
            return value.map(e => `<td>${e}</td>`).join('');
          }
          let row = `
          <tr>
            <td>
                <span class="custom-checkbox">
                    <input type="checkbox" id="checkbox1" name="options[]" value="1">
                    <label for="checkbox1"></label>
                </span>
            </td>
            ${createTabLeData(value)}
            <td>
                <a href="#editModal" class="td_edit" data-toggle="modal" data-do="Edit" data-id="${value[0]}">
                    <i class="material-icons" data-toggle="tooltip" title="Edit" data-do="Edit" data-id="${value[0]}">&#xE254;</i>
                </a>
                <a href="#deleteModal" class="td_delete" data-toggle="modal" data-do="Del" data-id="${value[0]}">
                    <i class="material-icons" data-toggle="tooltip" title="delete" data-do="DEL" data-id="${
                      value[0]
                    }">&#xE872;</i>
                </a>
            </td>
          </tr>
          `;
          return row;
        }
        return data.map(createTableRow).join('');
      }
      case 'EDIT':return function(record){
        // record = Object.keys(record[0])
        const {name, desc} = record[0];
        record = Object.keys(desc?{name, desc}:{name});
        function createBasicInputHTML(attr){
          return `
           <div class="form-group">
              <label>${attr}</label>
              <input id="Edit_${attr}" type="text" class="form-control" required>
          </div>`
        }
        return record.map(createBasicInputHTML).join('');        
      }
      case 'ADD':return function(record){
        // record = Object.keys(record[0])
        const {name, desc} = record[0];
        console.log(name, desc);
        record = Object.keys(desc?{name, desc}:{name});
        function createBasicInputHTML(attr){
          return `
           <div class="form-group">
              <label>${attr}</label>
              <input id="Add_${attr}" type="text" class="form-control" required>
          </div>`
        }
        return record.map(createBasicInputHTML).join('');        
      }
    }
  }
}

function translateSysCodeToApi(syscode, type){
  switch(type){
    case "all": return () => Api.get(`/api/${syscode}`);
    case "search": return (params) => Api.get(`/api/${syscode}`,params);
    case "create": return (data) => Api.post(`/api/${syscode}`, data);
    case "modify": return (params, data) => Api.patch(`/api/${syscode}`, params, data);
    case "delete": return (params, data) => Api.delete(`/api/${syscode}`, params, data);
  }
  return new Error("동작실패");
}
const tbHead = document.getElementById('tbHead');
const tbBody = document.getElementById('tbBody');
const mdEdit = document.querySelector("#editModal .modal-body");
const mdAdd = document.querySelector("#addModal .modal-body");
const mdDel = document.querySelector("#deleteModal .modal-body");

const EditSubmitButton = document.getElementById('EditSubmitButton');

addAllElements();
addAllEvents();


// html에 요소를 추가하는 함수들을 묶어주어서 코드를 깔끔하게 하는 역할임.
async function addAllElements() {
//   createCategoriesToTable();
  await createMenu();
  prepareModal();
}

// 여러 개의 addEventListener들을 묶어주어서 코드를 깔끔하게 하는 역할임.
async function addAllEvents() {
    // await createMenuToSystemCodeList();
}
async function createMenu(){
  const sysCodes = await Api.get('/api/admin/systemCodes');
  const menu = CreateTableHelper.createMenu(sysCodes);
  const systemCodeList = document.getElementById('systemCodeList');
  systemCodeList.insertAdjacentHTML("beforeend", menu);
  
  systemCodeList.querySelectorAll('button').forEach(e=>e.addEventListener('click',createTable));
  async function createTable(e){
    const {id, name} = e.target.dataset;
    const helper = new CreateTableHelper(name);
    const table = await helper.createTable(
      tbHead,
      tbBody,
      mdEdit,
      mdAdd,
      mdDel
    );
    console.log('table', table);
  }
}

