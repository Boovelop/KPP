window.addEventListener('load', function (e) {
    var data = [
        ['Tiger Nixon', 'System Architect', 'Edinburgh', '5421', '2011/04/25', '$3,120'],
        ['Garrett Winters', 'Director', 'Edinburgh', '8422', '2011/07/25', '$5,300'],
    ];

    new gridjs.Grid({
        columns: [
            {
                name: 'Name',
            },
            {
                name: 'Email',
            },
            {
                name: 'Phone Number',
                width: '50%',
            },
        ],
        data: [
            ['John', 'john@example.com', '(353) 01 222 3333'],
            ['Mark', 'mark@gmail.com', '(01) 22 888 4444'],
            ['Eoin', 'eoin@gmail.com', '0097 22 654 00033'],
            ['Sarah', 'sarahcdd@gmail.com', '+322 876 1233'],
            ['Afshin', 'afshin@mail.com', '(353) 22 87 8356'],
        ],
        search: {
            enabled: true,
        },
        sort: true,
        pagination: {
            enabled: true,
            limit: 20,
            summary: false,
        },
        language: {
            search: {
                placeholder: '🔍 Search...',
            },
            pagination: {
                previous: '이전',
                next: '다음',
                showing: '😃 Displaying',
                results: () => 'Records',
            },
        },
    }).render(document.getElementById('ttt'));
});
