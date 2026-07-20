const grid = document.querySelector('.grid');
const restart = document.querySelector('.restart-btn');
const UpdateName1 = document.querySelector('#name-btn1');
const UpdateName2 = document.querySelector('#name-btn2');
const player1Score = document.querySelector('#ply1_score');
const player2Score = document.querySelector('#ply2_score');
const gamecontainer = document.querySelector('.game-container');
const playerHeadings = document.querySelectorAll('.player-card h2');
let playerturn = 1;
let player1win = false;
let player2win = false;
let gridarray = [
    ['','',''],
    ['','',''],
    ['','','']
]
const cells = [...document.querySelectorAll('.cell')].map((cell)=> ({
    marking : '',
    element: cell,
}));

function Player(name){
    this.name = name;
    this.score = 0;
    
    this.getName = function(){
        return this.name;
    }

    this.getScore = function(){
        return this.score;
    }

    this.incrementScore = function() {
        this.score++;
    }

    this.updateName = function(newname){
        this.name = newname;
    }
}

let player1 = new Player("Player 1");
let player2 = new Player("Player 2");

function restartgame(){
    cells.forEach(cell => {
        cell.marking = '';
        cell.element.textContent = '';
    });
    player1win=false;
    player2win=false;
    for (let i=0;i<3;i++){
        for (let k=0;k<3;k++){
            gridarray[i][k]='';
        }
    }
}

restart.addEventListener('click', () => {
    restartgame();
})

function closeNameModal() {
    document.querySelector('.modal-overlay')?.remove();
}

function openNameModal(player, headingElement) {
    closeNameModal();

    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';

    const modal = document.createElement('div');
    modal.className = 'name-modal';

    const closeButton = document.createElement('button');
    closeButton.className = 'modal-close';
    closeButton.type = 'button';
    closeButton.textContent = '✕';
    closeButton.setAttribute('aria-label', 'Close name form');

    const title = document.createElement('h3');
    title.textContent = 'Update Name';

    const form = document.createElement('form');
    form.className = 'name-form';

    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = `Enter a new name for ${player.getName()}`;
    input.value = player.getName();
    input.maxLength = 20;
    input.required = true;

    const actions = document.createElement('div');
    actions.className = 'name-form-actions';

    const saveButton = document.createElement('button');
    saveButton.type = 'submit';
    saveButton.textContent = 'Save';

    const cancelButton = document.createElement('button');
    cancelButton.type = 'button';
    cancelButton.className = 'secondary-btn';
    cancelButton.textContent = 'Cancel';

    closeButton.addEventListener('click', closeNameModal);
    cancelButton.addEventListener('click', closeNameModal);

    overlay.addEventListener('click', (event) => {
        if (event.target === overlay) {
            closeNameModal();
        }
    });

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const newName = input.value.trim();

        if (newName) {
            player.updateName(newName);
            headingElement.textContent = newName;
        }

        closeNameModal();
    });

    actions.append(saveButton, cancelButton);
    form.append(input, actions);
    modal.append(closeButton, title, form);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    input.focus();
    input.select();
}

UpdateName1.addEventListener('click', () => {
    openNameModal(player1, playerHeadings[0]);
});

UpdateName2.addEventListener('click', () => {
    openNameModal(player2, playerHeadings[1]);
});

cells.forEach(cell => {
    cell.element.addEventListener('click', () => {
        if ((cell.marking === 'X' || cell.marking === 'O') || player1win || player2win){
            return;//tests to see if cell already contains marking or a winner has been established in the current round
        }else {
            /*tests which players turn it is and then marks the cell with the 
            appropiate marking*/
            if (playerturn === 1){
                cell.marking = 'X';
                cell.element.textContent = 'X';

            } else if (playerturn === 2) {
                cell.marking = 'O';
                cell.element.textContent = 'O';
            }

            TestWinner(cell.element);
            if (player1win){
                player1.incrementScore();
                player1Score.textContent = "Score: "+player1.getScore();
            } else if (player2win){
                player2.incrementScore();
                player2Score.textContent = "Score: "+player2.getScore();
            }
            playerturn = playerturn === 1 ? 2 : 1;
        }
    });
});

function TestWinner(cell){
    let mark = '';
    if (playerturn===1){
        mark = 'X';
    } else if (playerturn===2){
        mark = 'O';
    }

    switch(cell.getAttribute("id")){
        case '1': gridarray[0][0] = mark; break;
        case '2': gridarray[0][1] = mark; break;
        case '3': gridarray[0][2] = mark; break;
        case '4': gridarray[1][0] = mark; break;
        case '5': gridarray[1][1] = mark; break;
        case '6': gridarray[1][2] = mark; break;
        case '7': gridarray[2][0] = mark; break;
        case '8': gridarray[2][1] = mark; break;
        case '9': gridarray[2][2] = mark; break;
    }

    //check if a full row is completed
    for (let i=0;i<3;i++){
        if (gridarray[i][0] === gridarray[i][1] &&
            gridarray[i][1] === gridarray[i][2] &&
            gridarray[i][0] !== ''
            ){
            if (playerturn === 1) {
                player1win = true;
            } else if (playerturn === 2){
                player2win = true;
            }
            return;            
        }
    }

    //check if a full column is completed
    for (let i=0;i<3;i++){
        if (gridarray[0][i] === gridarray[1][i] &&
            gridarray[1][i] === gridarray[2][i] &&
            gridarray[0][i] !== '' 
        ){
            if (playerturn === 1) {
                player1win = true;
            } else if (playerturn === 2){
                player2win = true;
            }
            return; 
        }
    }

    //check if a diagonal
    if (gridarray[0][0] === gridarray[1][1] &&
        gridarray[1][1] === gridarray[2][2] &&
        gridarray[0][0] !== ''
    ){
        if (playerturn === 1) {
            player1win = true;
        } else if (playerturn === 2){
            player2win = true;
        }
        return;
    } else if (gridarray[0][2] === gridarray[1][1] &&
               gridarray[1][1] === gridarray[2][0] && gridarray[0][2] !== ''
    ){
        if (playerturn === 1) {
            player1win = true;
        } else if (playerturn === 2){
            player2win = true;
         }
        return;
    }
}