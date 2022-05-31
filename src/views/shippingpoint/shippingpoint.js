const sessionStore =
[
  {
    "_id": "62930b7c0e6470d07f097f55",
    "name": "몽페레 몽마르뜨 원피스 로얄핑크",
    "price": 37000,
    "category": "외출/패션",
    "image": "https://elice-team12.s3.ap-northeast-2.amazonaws.com/product_dummy/1653803900275.jpeg",
    "briefDesc": "여성스러운 퍼프소매 블라우스 원피스\r\n면 소재를 사용하여 편안한게 착용 가능\r\n고급스럽고 사랑스러운 느낌의 디자인",
    "fullDesc": "몽페레 몽마르뜨 원피스는 여성스러운 블라우스 원피스입니다. 고급스럽고 차분한 브라운톤 색상에 퍼프 소매, 2단 체크치마로 사랑스러움을 더해주었습니다. 또한 길이감이 있는 소매로 봄, 가을, 초겨울까지 착용 가능합니다. 세탁 시에는 찬물에 중성세제를 풀고 가볍게 주물러 손세탁 해주시고 통풍이 잘 되는 그늘에 건조시켜주시기 바랍니다. 반려동물의 신체 치수보다 목둘레 3cm, 가슴, 배둘레 4~5cm 정도 큰 사이즈로 주문하셔야 편하게 착용 가능합니다.",
    "manufacturer": "몽페레",
    "stock": 7,
    "keyword": ["로얄핑크", "고급소재", "블라우스", "원피스"],
    "createdAt": "2022-05-29T05:58:20.402Z",
    "updatedAt": "2022-05-29T05:58:20.402Z",
    "__v": 0,
    "count": 1
  },
  {
    "_id": "62930b490e6470d07f097f50",
    "name": "펫츠앤미 아기곰모자 브라운",
    "price": 29000,
    "category": "외출/패션",
    "image": "https://elice-team12.s3.ap-northeast-2.amazonaws.com/product_dummy/1653803848859.jpeg",
    "briefDesc": "귀여운 곰돌이가 될 수 있는 아기곰모자\r\n부드러운 소재를 사용하여 편안한 착용감\r\n턱 아래 스토퍼가 있어 사이즈 조절 가능",
    "fullDesc": "본 상품은 주문제작 상품으로 주문 후 발송까지 최소 7일 소요되므로 주문 전 참고부탁드립니다. 펫츠앤미 아기곰모자는 착용하면 귀여운 곰돌이가 될 수 있는 아기곰모자입니다. 부드러운 소재를 사용하여 편안하게 착용이 가능하며, 강아지 고양이 모두 착용이 가능합니다. 모자에 귀끈을 늘리거나, 턱 아래 스토퍼가 있어 사이즈 조절이 가능합니다. 본 상품은 핸드메이드 특성상 상품 별, 사이즈 별로 오차가 있을 수 있으며, 모자마다 실 두께가 다를 수 있습니다.",
    "manufacturer": "펫츠앤미",
    "stock": 5,
    "keyword": ["아기곰", "핸드메이드", "부드러운 소재"],
    "createdAt": "2022-05-29T05:57:29.001Z",
    "updatedAt": "2022-05-29T05:57:29.001Z",
    "__v": 0,
    "count": 1
  }
]


import * as Api from "/api.js";
import { addCommas } from "/useful-functions.js";

//user Inputs
const receiverNameInput = document.getElementById("receiverNameInput");
const receiverPhoneNumberInput = document.getElementById("receiverPhoneNumberInput");
const postalCodeInput = document.getElementById("postalCodeInput");
const address1Input = document.getElementById("address1Input");
const address2Input = document.getElementById("address2Input");
const customRequestInput = document.getElementById('customRequestInput');
const requestSelectBox = document.getElementById("requestSelectBox");
const searchAddressButton = document.getElementById("searchAddressButton");

//product summary
const productsTitle = document.getElementById("productsTitle");
const productsTotal = document.getElementById("productsTotal");
const deliveryFee = document.getElementById("deliveryFee");
const orderTotal = document.getElementById("orderTotal");

// send Data
const checkoutButton = document.getElementById("checkoutButton");


addAllElements();
addAllEvents();

async function addAllElements() {
    insertOrderSummary();
}

async function addAllEvents() {
    searchAddressButton.addEventListener('click', insertAddressToAddrInputs);
    checkoutButton.addEventListener('click',sendOrderInfoByPost);
    requestSelectBox.addEventListener('change', changeRequestBox);
}



function changeRequestBox(e){
  const selectedItem = e.target.value;
  if(selectedItem === "6"){
    customRequestInput.classList.remove('is-hidden');
  }
}


async function insertAddressToAddrInputs(){
    const {zonecode, address} = await searchAddressByDaumPost();
    postalCodeInput.value = zonecode;
    address1Input.value = address;
}

function insertOrderSummary(){
  if(!sessionStore || sessionStore.length < 1) return;
    console.log(sessionStore);
    let amount = 0;
    let Fee = 3000;

    globalThis.products = sessionStore
        .map(({_id, name, price, count}) =>{
            amount += price * count;
            return{_id, name, price, count,
              totalPrice: price * count, 
              title:`${name} / ${count}개`}
        })
    console.log("products", products, "amount", amount);
    productsTitle.innerHTML = products.map(({title}) => title).join('<br>');
    productsTotal.textContent = addCommas(amount)+'원';
    deliveryFee.textContent = addCommas(Fee)+'원';
    orderTotal.textContent = addCommas(Fee + amount)+'원';
}


function searchAddressByDaumPost() {
  return new Promise((resole) => {
    new daum.Postcode({
      oncomplete: function (data) {
        let addr = ""; // 주소 변수

        let buildingName = data.buildingName ? ` (${data.buildingName})` : "";
        //사용자가 선택한 주소 타입에 따라 해당 주소 값을 가져온다.
        if (data.userSelectedType === "R") {
          // 사용자가 도로명 주소를 선택했을 경우
          addr = `${data.roadAddress}${buildingName}`;
        } else {
          // 사용자가 지번 주소를 선택했을 경우(J)
          addr = `${data.jibunAddress}${buildingName}`;
        }

        // 우편번호와 주소 정보를 해당 필드에 넣는다.
        const zonecode = data.zonecode;
        const address = addr;
        // 커서를 상세주소 필드로 이동한다.
        resole({ zonecode, address });
      },
    }).open();
  });
}

//회원정보 수정 진행
async function sendOrderInfoByPost(e) {
  e.preventDefault();

  const receiverName = receiverNameInput.value;
  const receiverPhoneNumber = receiverPhoneNumberInput.value;
  const postalCode =  postalCodeInput.value;
  const address1 = address1Input.value;
  const address2  = address2Input.value;
  const requestSelect = requestSelectBox.value;

  const data = globalThis.products;
  console.log(requestSelect, data);

  // const OrderInfo = {

  // }

  // try {
  //   const result = Api.postMulti('/api/order~~~', OrderInfo);
  //   console.log(keywordArray);
  // } catch (err) {
  //   console.error(err.stack);
  //   alert(`문제가 발생하였습니다. 확인 후 다시 시도해 주세요: ${err.message}`);
  // }
  // alert(productName+" "+productText+" "+imagedata);
}
