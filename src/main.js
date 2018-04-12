import $ from 'jquery';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles.css';

$(function(){
  main();
});

let nums = [0,1,2];
let gen_nums = [];

function in_array(array, el) {
   for(let i = 0 ; i < array.length; i++)
       if(array[i] == el) return true;
   return false;
}

function get_rand(array) {
    let rand = array[Math.floor(Math.random()*array.length)];
    if(!in_array(gen_nums, rand)) {
       gen_nums.push(rand);
       return rand;
    }
    return get_rand(array);
}

function main()
{

  let promise = new Promise(function(resolve, reject) {
      let request = new XMLHttpRequest();
      let url = `https://opentdb.com/api.php?amount=1&category=10&difficulty=easy&type=multiple`;
      request.onload = function() {
        if (this.status === 200) {
          resolve(request.response);
        } else {
          reject(Error(request.statusText));
        }
      }
      request.open("GET", url, true);
      request.send();
  });

  promise.then(function(response){
    let body = JSON.parse(response);
    console.log(body);
    let myResponse = `${body.results[0].question}`;
    let myParsedResponse = myResponse.replace(/&#039;|&quot;/g,'"');

    $('#show-question').text("Question: " + `${myParsedResponse}`);
      for(let i = 0; i < 3; i++){
        $('#choice' + i.toString()).text(`${body.results[0].incorrect_answers[get_rand(nums)]}`);
      }
      $('#choice3').text(`${body.results[0].correct_answer}`);

      $("#submit-btn").click(function(){
        let response = $("#choices").val();
        function scoreKeeper(){
          let score = 0;
          if(response == `${body.results[0].correct_answer}`){
            score += 200;
            alert("You got 200 points!");
          }else{
            score -= 200;
            alert("You lost 200 points!");
          }
        }
        scoreKeeper();
      });
    },function(error) {
      $('.showErrors').text(`There was an error processing your request: ${error.message}`);
  });
}
