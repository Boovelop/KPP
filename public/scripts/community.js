const community = {
  socket: io('/chat'),
  table: null,
  tablesData: null,
  viewSections: {
    board: null, // 게시판 view
    chat: null, // 실시간 채팅 view
  },

  btnElements: {
    warpBoard: null, // 게시판 메뉴 버튼
    warpChat: null, // 실시간 채팅 메뉴 버튼
  },
  chat: {
    elements: {
      MessageList: null, // 실시간 채팅 글 목록
      inputNickName: null, // 채팅 닉네임
      inputMessage: null, // 채팅 내용
      inputNickNameBorderStyle: null,
      inputMessageBorderStyle: null,
      inputBorder: [],
    },
    userColor: userColor,
  },

  initBindElements() {
    this.viewSections.board =
      document.getElementsByClassName('section-board')[0];
    this.viewSections.chat = document.getElementsByClassName('section-chat')[0];
    this.btnElements.warpBoard = document.getElementById('warp-board');
    this.btnElements.warpChat = document.getElementById('warp-chat');
    this.chat.elements.MessageList = document.getElementById('chat-list');
    this.chat.elements.inputNickName =
      document.getElementById('chat-user-name');
    this.chat.elements.inputMessage = document.getElementById('chat-input');

    this.chat.elements.inputNickNameBorderStyle =
      this.chat.elements.inputNickName.style.border;
    this.chat.elements.inputMessageBorderStyle =
      this.chat.elements.inputMessage.style.border;
  },

  initState() {
    this.onClickWarpBoard();
  },

  initEventListener() {
    document
      .getElementById('write')
      .addEventListener('click', this.onClickWriteBtn);
    document
      .getElementById('chat-send')
      .addEventListener('click', this.onSendMessage);

    this.btnElements.warpBoard.addEventListener('click', this.onClickWarpBoard);
    this.btnElements.warpChat.addEventListener('click', this.onClickWarpChat);
    this.chat.elements.inputMessage.addEventListener(
      'keydown',
      this.onKeyDownChatMessage,
    );
  },

  async initTables() {
    const dataArray = await this.getTablesData();

    this.table = $('#board-table').DataTable({
      data: dataArray,
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
        {
          title: '작성일',
          data: 'created_at',
          className: 'column-dateCreated',
          searchable: false,
        },
        {
          title: '조회수',
          data: 'views',
          className: 'column-views',
          searchable: false,
        },
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
    $('#board-table tbody').on(
      'click',
      '.column-title',
      this.onClickBoardTitle,
    );
  },

  initChat() {
    // 채팅 스크롤 최하단으로 이동
    this.chat.elements.MessageList.scrollTop =
      this.chat.elements.MessageList.scrollHeight;

    const userName = this.chat.elements.inputNickName.value;
    if (userName) this.chat.elements.inputNickName.disabled = true;
    utils.setElementStyle(
      this.chat.elements.inputNickName,
      'color',
      this.chat.userColor,
    );

    // 메세지 받는 소켓
    this.socket.on('receive_message', function (data) {
      const messageContainer = document.createElement('li');
      messageContainer.classList.add('chat-message-container');

      // 내가 보낸 메세지인지 아닌지 확인 및 class 선택자 추가
      if (data.userColor == community.chat.userColor)
        messageContainer.classList.add('mine');
      else messageContainer.classList.add('other');

      const nameTag = document.createElement('p');
      nameTag.classList.add('chat-message-name');
      nameTag.style.color = data.userColor;
      nameTag.textContent = data.name;

      const messageTag = document.createElement('p');
      messageTag.classList.add('chat-message-text');
      messageTag.textContent = data.message;

      const clearBothTag = document.createElement('div');
      clearBothTag.classList.add('clear');

      messageContainer.appendChild(nameTag);
      messageContainer.appendChild(messageTag);

      community.chat.elements.MessageList.appendChild(messageContainer);
      community.chat.elements.MessageList.appendChild(clearBothTag);

      // 채팅 스크롤 최 하단으로 이동
      community.chat.elements.MessageList.scrollTop =
        community.chat.elements.MessageList.scrollHeight;
    });
  },

  async getTablesData() {
    const response = await serverUtils.getFetching('/board', {
      'Content-Type': 'application/json',
    });
    this.tablesData = response;
    return response;
  },
  changeView(view) {
    const isBoard = view == 'board';
    this.viewSections.chat.hidden = isBoard;
    this.viewSections.board.hidden = !isBoard;

    const activeColor = '#0066ff';
    const inActiveColor = 'black';

    utils.setElementStyle(
      this.btnElements.warpBoard,
      'color',
      isBoard == true ? activeColor : inActiveColor,
    );
    utils.setElementStyle(
      this.btnElements.warpChat,
      'color',
      isBoard == true ? inActiveColor : activeColor,
    );
  },
  // ------------------- EventListener -------------------
  onClickBoardTitle(e) {
    const index = community.table.row(this)[0];
    const data = community.tablesData[index];
    window.location.replace(`/read?id=${data.id}&title=${data.title}`);
  },
  async onClickWriteBtn(e) {
    if (await auth.isLogin()) {
      window.location.replace('/write');
    } else {
      Swal.fire({
        icon: 'error',
        text: '글쓰기에 로그인이 필요합니다!',
      });
      return;
    }
  },
  onClickWarpBoard(e) {
    community.changeView('board');
  },
  onClickWarpChat(e) {
    community.changeView('chat');
  },
  onKeyDownChatMessage(e) {
    // 엔터키 입력시 메시지 보내기ㅣ
    if (e.keyCode == 13) community.onSendMessage(e);
  },
  onSendMessage(e) {
    e.preventDefault();
    if (!community.chat.elements.inputNickName.value) {
      community.onSendChatErrorAnimation(
        community.chat.elements.inputNickName,
        community.chat.elements.inputNickNameBorderStyle,
      );
      return;
    }
    if (!community.chat.elements.inputMessage.value) {
      community.onSendChatErrorAnimation(
        community.chat.elements.inputMessage,
        community.chat.elements.inputMessageBorderStyle,
      );
      return;
    }

    community.socket.emit('send_message', {
      name: community.chat.elements.inputNickName.value,
      message: community.chat.elements.inputMessage.value,
    });

    community.chat.elements.inputMessage.value = '';
    community.chat.elements.inputMessage.focus();
  },
  onSendChatErrorAnimation(element, border) {
    const animateOptions = ['animate__animated', 'animate__headShake'];
    // 애니메이션 추가
    element.classList.add(animateOptions[0], animateOptions[1]);
    element.style.setProperty('--animate-duration', '0.5s');
    utils.setElementStyle(element, 'border', '1px solid red');

    // 애니메이션 끝나는 이벤트 처리
    element.addEventListener('animationend', function (e) {
      e.target.classList.remove(animateOptions[0], animateOptions[1]);
      e.target.style.border = border;
    });
  },
};

window.addEventListener('load', function (e) {
  community.initBindElements();
  community.initEventListener();
  community.initState();
  community.initTables();
  community.initChat();
});
