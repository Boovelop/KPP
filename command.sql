insert into users(login_type, user_id, user_name)
values('kakao', 'ee', '멋진놈');

update users
set user_id='아이디'
where user_id='ee';

select * 
from users 
where user_id = '아이디';

drop database kpp;
create database kpp;