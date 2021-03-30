const communityObj = {
    table: null,
    tableDatas: null,
    viewSections: {
        board: null, // 게시판 view
        chat: null, // 실시간 채팅 view
    },
    warpElements: {
        board: null, // 게시판 a tag 버튼
        chat: null, // 실시간 채팅 a tag 버튼
    },
    chat: {
        elements: {
            list: null, // 실시간 채팅 글 목록
            inputNickName: null, // 채팅 닉네임
            inputMessage: null, // 채팅 내용
        },
        styles: {
            inputBorder: [],
        },
    },
};

const socket = io('/chat');

window.addEventListener('load', function (e) {
    community_initObj();
    community_initEvent();
    community_initTables();
    community_initChat();
});

function community_initObj() {
    communityObj.viewSections.board = document.getElementsByClassName('section-board')[0];
    communityObj.viewSections.chat = document.getElementsByClassName('section-chat')[0];
    communityObj.warpElements.board = document.getElementById('warp-board');
    communityObj.warpElements.chat = document.getElementById('warp-chat');
    communityObj.chat.elements.list = document.getElementById('chat-list');
    communityObj.chat.elements.inputNickName = document.getElementById('chat-user-name');
    communityObj.chat.elements.inputMessage = document.getElementById('chat-input');
}

function community_initEvent() {
    document.getElementById('write').addEventListener('click', community_onClickWriteBtn);
    communityObj.warpElements.board.addEventListener('click', community_onClickWarpBoard);
    communityObj.warpElements.chat.addEventListener('click', community_onClickWarpChat);
    communityObj.chat.elements.inputMessage.addEventListener('keydown', community_keyDownSendChatMessageEvent);
    document.getElementById('chat-send').addEventListener('click', community_sendChatMessage);

    community_onClickWarpBoard();
}

async function community_initTables() {
    const datas = await community_getTablesData();

    communityObj.table = $('#board-table').DataTable({
        data: datas,
        columns: [
            {
                title: '제목',
                data: 'title',
                className: 'column-title',
                render: function (data, type, row, meta) {
                    return `<a href="#">${data}</a>`;
                },
            },
            { title: '작성자', data: 'author', className: 'column-author' },
            { title: '작성일', data: 'created_at', className: 'column-dateCreated', searchable: false },
            { title: '조회수', data: 'views', className: 'column-views', searchable: false },
        ],

        order: [[2, 'desc']], // 작성일을 기준으로 내림차순 정렬을 기본으로 설정

        language: {
            emptyTable: '작성된 글이 없습니다.',
            lengthMenu: '페이지당 _MENU_ 개씩 보기',
            info: '현재 _START_ - _END_ / _TOTAL_건',
            infoEmpty: '데이터 없음',
            infoFiltered: '( _MAX_건의 데이터에서 필터링 됨 )',
            search: '<i class="fas fa-search"></i>',
            zeroRecords: '검색과 일치하는 데이터가 없습니다.',
            loadingRecords: '로딩중...',
            processing: '잠시만 기다려 주세요~',
            paginate: {
                first: '처음',
                next: '다음',
                previous: '이전',
                last: '끝',
            },
        },

        pagingType: 'full_numbers',

        responsive: true, // 반응형, 폭이 좁아지면 + 기호가 표시되고, 클릭하면 하단에 나머지 컬럼이 보인다.
        autoWidth: true, // 컬럼 자동 폭 조정
    });

    // 제목 클릭 처리
    $('#board-table tbody').on('click', '.column-title', community_onClickBoardTitle);
}

function community_initChat() {
    // 채팅 스크롤 최 하단으로 이동
    communityObj.chat.elements.list.scrollTop = communityObj.chat.elements.list.scrollHeight;

    const userName = communityObj.chat.elements.inputNickName.value;
    if (userName) {
        communityObj.chat.elements.inputNickName.disabled = true;
    }
    common_setElementStyle(communityObj.chat.elements.inputNickName, 'color', userColor);

    // 메세지 받는 소켓
    socket.on('receive_message', function (data) {
        const messsageContainer = document.createElement('li');
        messsageContainer.classList.add('chat-message-container');

        // 내가 보낸 메세지인지 아닌지 확인 및 class 선택자 추가
        if (data.userColor == userColor) messsageContainer.classList.add('mine');
        else messsageContainer.classList.add('other');

        const nameTag = document.createElement('p');
        nameTag.classList.add('chat-message-name');
        nameTag.style.color = data.userColor;
        nameTag.textContent = data.name;

        const messageTag = document.createElement('p');
        messageTag.classList.add('chat-message-text');
        messageTag.textContent = data.message;

        const clearBothTag = document.createElement('div');
        clearBothTag.classList.add('clear');

        messsageContainer.appendChild(nameTag);
        messsageContainer.appendChild(messageTag);

        communityObj.chat.elements.list.appendChild(messsageContainer);
        communityObj.chat.elements.list.appendChild(clearBothTag);

        // 채팅 스크롤 최 하단으로 이동
        communityObj.chat.elements.list.scrollTop = communityObj.chat.elements.list.scrollHeight;
    });
}

async function community_getTablesData() {
    const response = await common_getBoards();

    // for (let i = 0; i < response.length; i++) {
    // 	response[i].created_at = common_getCreatedAtFormat(response[i].created_at);
    // }

    communityObj.tableDatas = response;

    return response;
}

// 게시판 글 클릭시 호출되는 콜백 함수
function community_onClickBoardTitle(e) {
    // 테이블의 데이터를 가져온다. data는 테이블에서 설정한 "columns"이며  배열형태로 되어있다.
    // const data = boardObj.table.row(this).data();

    const index = communityObj.table.row(this)[0];
    const data = communityObj.tableDatas[index];

    window.location.replace(`/selectBoard?id=${data.id}&title=${data.title}`);
}

function community_onClickWriteBtn(e) {
    e.preventDefault();

    common_loginCheck().then(function (response) {
        if (!response.isLogin) {
            Swal.fire({
                icon: 'error',
                text: '글쓰기에 로그인이 필요합니다!',
            });
            return;
        }
        window.location.replace('/write');
    });
}
// 게시판 클릭시 호출되는 함수
function community_onClickWarpBoard(e) {
    community_setWarpState(true);
}

// 실시간 채팅 클릭시 호출되는 함수
function community_onClickWarpChat(e) {
    community_setWarpState(false);
}

function community_setWarpState(isBoard) {
    communityObj.viewSections.chat.hidden = isBoard;
    communityObj.viewSections.board.hidden = !isBoard;

    const activeColor = '#0066ff';
    const inActiveColor = 'black';

    common_setElementStyle(communityObj.warpElements.board, 'color', isBoard == true ? activeColor : inActiveColor);
    common_setElementStyle(communityObj.warpElements.chat, 'color', isBoard == true ? inActiveColor : activeColor);
}

function community_keyDownSendChatMessageEvent(e) {
    // 엔터키 확인 후 보내기 기능 호출
    if (e.keyCode == 13) community_sendChatMessage(e);
}

// 채팅에서 보내기 버튼 클릭시 호출되는 함수
function community_sendChatMessage(e) {
    e.preventDefault();

    if (!communityObj.chat.elements.inputNickName.value) {
        community_sendChatErrorAnimation(communityObj.chat.elements.inputNickName, communityObj.chat.styles.inputBorder[0]);
        return;
    }
    if (!communityObj.chat.elements.inputMessage.value) {
        community_sendChatErrorAnimation(communityObj.chat.elements.inputMessage, communityObj.chat.styles.inputBorder[1]);
        return;
    }

    socket.emit('send_message', {
        name: communityObj.chat.elements.inputNickName.value,
        message: communityObj.chat.elements.inputMessage.value,
    });

    communityObj.chat.elements.inputMessage.value = '';
    communityObj.chat.elements.inputMessage.focus();
}

const animateOptions = ['animate__animated', 'animate__headShake'];
function community_sendChatErrorAnimation(element, saveStyle) {
    // 애니메이션 추가
    element.classList.add(animateOptions[0], animateOptions[1]);
    element.style.setProperty('--animate-duration', '0.5s');

    saveStyle = element.style.border;
    common_setElementStyle(element, 'border', '1px solid red');

    // 애니메이션 끝나는 이벤트 처리
    element.addEventListener('animationend', function (e) {
        e.target.classList.remove(animateOptions[0], animateOptions[1]);

        e.target.style.border = saveStyle;
        // common_setElementStyle(e.target, 'border', '1px solid black');
    });
}
