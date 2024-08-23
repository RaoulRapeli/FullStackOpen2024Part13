CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,
    author TEXT,
    url TEXT NOT NULL,
    title TEXT NOT NULL,
    likes INTEGER DEFAULT 0
);

insert into blogs (author, url, title) values ('Raoul Rapeli','www.google.com', 'Link to google');
insert into blogs (author, url, title, likes) values ('Raoul Rapeli','www.facebook.com', 'Link to facebook', -1);