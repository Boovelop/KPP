class BoardTableData {
	constructor(name) {
		this.name = name;
	}
}
const boardObj = {
	table: null,
};

window.addEventListener('load', function (e) {
	community_initTables();
});

function community_initTables() {
	community_getTablesData();

	const data = [
		['Tiger Nixon', 'System Architect', '2011/04/25', '1'],
		[
			'Garrett Wintersasdfwerwerwrer42344343423423423423423423423444444adsfsdfffsff324234234243242423423423!!!!',
			'Director',
			'2011/07/25',
			'2222',
		],
	];

	boardObj.table = $('#board-table').DataTable({
		data: data,
		columns: [
			{
				title: '제목',
				className: 'column-title',
				render: function (data, type, row, meta) {
					return `<a href="#">${data}</a>`;
				},
			},
			{ title: '작성자', className: 'column-author' },
			{ title: '작성일', className: 'column-dateCreated', searchable: false },
			{ title: '조회수', className: 'column-views', searchable: false },
		],

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

	// $(document).ready(function() {

	// 	var strIconSearch = '<i class="fas fa-search"></i>';
	// 	var tableTitle = 'Summary of Employees';
	// 	var tableSubTitle = 'Current Listing of Active Employees';
	// 	var tableBS4 = $('#dtPluginExample').DataTable( {
	// 		language: {
	// 			lengthMenu: "Show _MENU_ Entries",
	// 			search: strIconSearch,
	// 			info: "Showing _START_ to _END_ of _TOTAL_ Entries"
	// 		},
	// 		pageLength: 10,
	// 		searching: true,
	// 		info: true,
	// 		columnDefs: [
	// 			{ targets: [0], className:'text-center bg-warning' },
	// 			{ targets: [1, 2], className:'text-left bg-light' },
	// 		],
	// 		buttons: {
	// 			buttons: [
	// 				{ extend: 'copyHtml5',
	// 					text: '<i class="fas fa-copy"></i>',
	// 					className: 'btn-primary',
	// 					title: tableTitle,
	// 					messageTop: tableSubTitle,
	// 					titleAttr: 'Copy to Clipboard'
	// 				},
	// 				{ extend: 'csvHtml5',
	// 					text: '<i class="fas fa-file-csv"></i>',
	// 					className: 'btn-primary',
	// 					titleAttr: 'Export to CSV'
	// 				},
	// 				{ extend: 'excelHtml5',
	// 					text: '<i class="fas fa-file-excel"></i>',
	// 					className: 'btn-primary',
	// 					title: tableTitle,
	// 					messageTop: tableSubTitle,
	// 					titleAttr: 'Export to Excel'
	// 				},
	// 				{ extend: 'pdfHtml5',
	// 					text: '<i class="fas fa-file-pdf"></i>',
	// 					className: 'btn-primary',
	// 					title: tableTitle,
	// 					messageTop: tableSubTitle,
	// 					titleAttr: 'Export to PDF'
	// 				},
	// 				{ extend: 'print',
	// 					text: '<i class="fas fa-print"></i>',
	// 					className: 'btn-primary',
	// 					title: tableTitle,
	// 					messageTop: tableSubTitle,
	// 					titleAttr: 'Print Table'
	// 				},
	// 				{ extend: 'colvis',
	// 					text: '<i class="fas fa-columns"></i>',
	// 					className: 'btn-primary',
	// 					titleAttr: 'Show/Hide Columns'
	// 				}
	// 			],
	// 			dom: {
	// 				   button: {
	// 				className: 'btn'
	// 				}
	// 			}
	// 		}
	// 	});

	// 	// Add a row for the Title & Subtitle in front of the first row of the wrapper
	// 	var divTitle = ''
	// 		+ '<div class="col-12 text-center text-md-left">'
	// 		+ '<h4 class="text-primary">' + tableTitle + '</h4>'
	// 		+ '<h5 class="text-primary">' + tableSubTitle + '</h5>'
	// 		+ '<hr class="m-0 mb-4" style="border:none; background-color:rgba(0,75,141,1.0); color:rgba(0,75,141,1.0); height:1px;" />'
	// 		+ '</div>';
	// 	$( divTitle ).prependTo( '#dtPluginExample_wrapper .row:eq(0)' );

	// 	// Insert the Button Toolbar in front of the first row of the wrapper.
	// 	// Had to add BS4-Classes first for proper Responsive/Horizontal Alignment.
	// 	tableBS4.buttons().container().addClass("justify-content-center justify-content-md-start mb-3");
	// 	tableBS4.buttons().container().prependTo( '#dtPluginExample_wrapper .col-12:eq(0)' );

	// 	// Table Header
	// 	//    1. Remove BS4-Classes for Background set in the columnDefs Options above,
	// 	//    2. Add BS4-Class for White Text on Black Background
	// 	//    3. Reduce Font Size
	// 	// $('#dtPluginExample thead tr th').removeClass("bg-warning bg-light bg-success").addClass("bg-dark text-white").css("font-size", "0.85rem");
	// 	$('thead tr th').removeClass("bg-warning bg-light bg-success").addClass("bg-dark text-white").css("font-size", "0.85rem");

	// 	// Table Footer
	// 	//    1. Remove BS4-Classes for Background set in the columnDefs Options above,
	// 	//    2. Add BS4-Class for White Text on Black Background
	// 	//    3. Reduce Font Size
	// 	//    4. Remove Horizontal Alignments set above and reassign for Totals.
	// 	$('tfoot tr th').removeClass("bg-warning bg-light bg-success text-left text-center text-right").addClass("bg-dark text-white").css("font-size", "0.85rem");
	// 	$('tfoot tr th:eq(1)').addClass("text-left");
	// 	$('tfoot tr th:eq(6)').addClass("text-right");

	// 	// Table Body
	// 	//    1. Reduce Font Size
	// 	// $('#dtPluginExample tbody tr td').css("font-size", "0.90rem");		 	// This did not work for records beyond initial rendering.  See CSS.
	// 	// $('#dtPluginExample tbody tr td').addClass("atr-datatables-bs4-td");		// This did not work for records beyond initial rendering.  See CSS.

	// 	$("input.form-control.form-control-sm").attr('placeholder', 'Search...');
	// 	$("input.form-control.form-control-sm").attr('size', 30);

	// 	// Button Toolbar & DataTables Dropdown - Add BS4-Class for Vertical Alignment (in first of 2 columns)
	// 	$('#dtPluginExample_wrapper .col-md-6:eq(0)').addClass("align-self-end");

	// 	// Search Box - Add BS4-Class for Vertical Alignment (in second of 2 columns)
	// 	$('#dtPluginExample_wrapper .col-md-6:eq(1)').addClass("align-self-end");

	// 	// Pagination - Add BS4-Class for Horizontal Alignment (in second of 2 columns) & Top Margin
	// 	$('#dtPluginExample_wrapper .col-md-7:eq(0)').addClass("d-flex justify-content-center justify-content-md-end");
	// 	$('#dtPluginExample_paginate').addClass("mt-3 mt-md-2");

	// });
}

function community_getTablesData() {}

// 게시판 글 클릭시 호출되는 콜백 함수
function community_onClickBoardTitle(e) {
	// 테이블의 데이터를 가져온다. data는 테이블에서 설정한 "columns"이며  배열형태로 되어있다.
	const data = boardObj.table.row(this).data();

	console.log(data);
}
