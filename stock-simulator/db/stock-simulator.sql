PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;

DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS following;
DROP TABLE IF EXISTS stocklist;
DROP TABLE IF EXISTS stocks;
DROP TABLE IF EXISTS diffs;
DROP TABLE IF EXISTS watchlist;
DROP TABLE IF EXISTS portfolio;
DROP TABLE IF EXISTS purchases;

CREATE TABLE users(
    id TEXT PRIMARY KEY,
    password TEXT NOT NULL,
    fName TEXT NOT NULL,
    lName TEXT NOT NULL,
    wallet INTEGER NOT NULL
);

CREATE TABLE following(
    follower_id TEXT NOT NULL,
    following_id TEXT NOT NULL,
    primary key(follower_id, following_id),
    CONSTRAINT fk_users
        FOREIGN KEY (follower_id)
        REFERENCES users(id),
    CONSTRAINT fk_users
        FOREIGN KEY (following_id)
        REFERENCES users(id)
);

CREATE TABLE stocklist(
    symbol TEXT PRIMARY KEY,
    image TEXT NOT NULL,
    category TEXT NOT NULL
);

CREATE TABLE stocks(
    symbol TEXT PRIMARY KEY,
    company TEXT NOT NULL,
    price INTEGER NOT NULL
);

CREATE TABLE diffs(
    symbol TEXT PRIMARY KEY,
    day INTEGER NOT NULL,
    week INTEGER NOT NULL,
    month INTEGER NOT NULL,
    year INTEGER NOT NULL
);


CREATE TABLE watchlist(
    user_id TEXT NOT NULL,
    symbol TEXT NOT NULL,
    primary key(user_id, symbol),
    CONSTRAINT fk_users
        FOREIGN KEY (user_id)
        REFERENCES users(id),
    CONSTRAINT fk_stocks
        FOREIGN KEY (symbol)
        REFERENCES users(symbol)
);

CREATE TABLE portfolio(
    user_id TEXT NOT NULL,
    symbol TEXT NOT NULL,
    primary key(user_id, symbol),
    CONSTRAINT fk_users
        FOREIGN KEY (user_id)
        REFERENCES users(id),
    CONSTRAINT fk_stocks
        FOREIGN KEY (symbol)
        REFERENCES users(symbol)
);


CREATE TABLE purchases(
    purchase_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    symbol TEXT NOT NULL,
    price INTEGER NOT NULL,
    shares INTEGER NOT NULL,
    sold BOOLEAN NOT NULL
);

--insert mock users
INSERT INTO users VALUES('bobby','12345','Bobby','Bob', 34000);
INSERT INTO users VALUES('maddy','12345','Maddy','Mad', 23500);
INSERT INTO users VALUES('stock_master','12345','Stocky','Stock', 120465);
INSERT INTO users VALUES('uncle_sam','12345','Uncle','Sam', 232810);
INSERT INTO users VALUES('aunt_debby','12345','Aunt','Debby', 12639);

--insert followings
INSERT INTO following VALUES('bobby', 'maddy');
INSERT INTO following VALUES('bobby', 'stock_master');
INSERT INTO following VALUES('bobby', 'uncle_sam');

--insert mock stocks
--insert stocklist
INSERT INTO stocklist VALUES('XOM', 'https://logodix.com/logo/268321.png', 'Energy');
INSERT INTO stocklist VALUES('CVX', 'https://media.designrush.com/inspiration_images/134801/conversions/_1511456381_693_chevron-preview.jpg', 'Energy');
INSERT INTO stocklist VALUES('SHEL', 'https://upload.wikimedia.org/wikipedia/en/thumb/e/e8/Shell_logo.svg/1200px-Shell_logo.svg.png', 'Energy');
INSERT INTO stocklist VALUES('NEE', 'https://thumbor.forbes.com/thumbor/fit-in/600x300/https://www.forbes.com/advisor/wp-content/uploads/2022/06/og-logo-removebg-preview.png', 'Energy');
INSERT INTO stocklist VALUES('SPWR', 'https://g.foolcdn.com/art/companylogos/square/spwr.png', 'Energy');
INSERT INTO stocklist VALUES('TTE', 'https://s3-symbol-logo.tradingview.com/total--600.png', 'Energy');
INSERT INTO stocklist VALUES('LNG', 'https://www.marketbeat.com/logos/cheniere-energy-partners-lp-logo.png?v=20230815112904', 'Energy');
INSERT INTO stocklist VALUES('BEP', 'https://images.crunchbase.com/image/upload/c_lpad,h_256,w_256,f_auto,q_auto:eco,dpr_1/ftywp0uqny4wpkpvnxmx', 'Energy');
INSERT INTO stocklist VALUES('COP', 'https://yt3.googleusercontent.com/DMPr_bb-XvbmUjmksiI9ulnoYgl0yrBvNmt-XqjkCVgu1Ud8arqRLHCoPArvK_ypZibX0xILlsg=s900-c-k-c0x00ffffff-no-rj', 'Energy');
INSERT INTO stocklist VALUES('ENG', 'https://s3-symbol-logo.tradingview.com/englobal-corporation--600.png', 'Energy');

INSERT INTO stocklist VALUES('LIN', 'https://static.stocktitan.net/company-logo/LIN-lg.png', 'Materials');
INSERT INTO stocklist VALUES('BHP', 'https://pbs.twimg.com/profile_images/863828491464130564/ELuG-2o6_400x400.jpg', 'Materials');
INSERT INTO stocklist VALUES('SHW', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLjpfoIhMlq-oXo5xQtLHuD_4dPOJmKTsDow&usqp=CAU', 'Materials');
INSERT INTO stocklist VALUES('APD', 'https://s3-symbol-logo.tradingview.com/air-products-and-chemicals--600.png', 'Materials');
INSERT INTO stocklist VALUES('VALE', 'https://miningafrica.net/wp-content/uploads/2020/12/Vale-logo-2.jpg', 'Materials');
INSERT INTO stocklist VALUES('SCCO', 'https://is1-ssl.mzstatic.com/image/thumb/Purple116/v4/49/d4/c8/49d4c813-8138-d3e7-d58d-52debd05ccef/AppIconARKANSAS-0-0-1x_U007emarketing-0-0-0-10-0-0-sRGB-0-0-0-GLES2_U002c0-512MB-85-220-0-0.png/1200x630wa.png', 'Materials');
INSERT INTO stocklist VALUES('FCX', 'https://s3-symbol-logo.tradingview.com/freeport-mcmoran--600.png', 'Materials');
INSERT INTO stocklist VALUES('RIO', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOFkIuQt19IMeQXBiyVDwofnhuQh2VTWWjiQ&usqp=CAU', 'Materials');
INSERT INTO stocklist VALUES('ECL', 'https://companieslogo.com/img/orig/ECL-b417c4a1.png?t=1654489788', 'Materials');
INSERT INTO stocklist VALUES('CRH', 'https://upload.wikimedia.org/wikipedia/en/a/ac/CRH_logo.svg', 'Materials');

INSERT INTO stocklist VALUES('CAT', 'https://wallpaperaccess.com/full/3579410.png', 'Industrial');
INSERT INTO stocklist VALUES('UPS', 'https://www.puzzelpuzzels.nl/imatjes/528a4e2ab51b2-p.jpg', 'Industrial');
INSERT INTO stocklist VALUES('UNP', 'https://www.american-rails.com/images/087NN1760KLP09167GG615716.jpg', 'Industrial');
INSERT INTO stocklist VALUES('HON', 'https://d1yjjnpx0p53s8.cloudfront.net/styles/logo-thumbnail/s3/122015/untitled-1_66.png?itok=WxKDQdNQ', 'Industrial');
INSERT INTO stocklist VALUES('GE', 'https://i.pinimg.com/736x/5e/fd/81/5efd81abd37a724a82e7f46ea6e1bc95.jpg', 'Industrial');
INSERT INTO stocklist VALUES('BA', 'https://d1yjjnpx0p53s8.cloudfront.net/styles/logo-thumbnail/s3/102014/boeinglogo.png?itok=1H1JUfJc', 'Industrial');
INSERT INTO stocklist VALUES('DE', 'https://static.stocktitan.net/company-logo/DE-lg.png', 'Industrial');
INSERT INTO stocklist VALUES('RTX', 'https://media.zenfs.com/en/us.finance.gurufocus/cb49ba262b0d4274fac397195c7d1730', 'Industrial');
INSERT INTO stocklist VALUES('FDX', 'https://cdn.benzinga.com/files/imagecache/1024x768xUP/images/story/2023/09/11/fdx_1.png', 'Industrial');

INSERT INTO stocklist VALUES('LLY', 'https://cdn.worldvectorlogo.com/logos/lilly-1.svg', 'Healthcare');
INSERT INTO stocklist VALUES('UNH', 'https://d1yjjnpx0p53s8.cloudfront.net/styles/logo-thumbnail/s3/062011/unitedhealth-group.png?itok=8Uli1Sqm', 'Healthcare');
INSERT INTO stocklist VALUES('NVO', 'https://media.licdn.com/dms/image/D4E0BAQEHDDS3zgV1eg/company-logo_200_200/0/1688197985925/novo_nordisk_logo?e=2147483647&v=beta&t=-MHx6EjRyvRwMSb13PuMBHOXM5XjqIhRUoj1-h6gn4s', 'Healthcare');
INSERT INTO stocklist VALUES('JNJ', 'https://invest-brands.cdn-tinkoff.ru/US4781601046x640.png', 'Healthcare');
INSERT INTO stocklist VALUES('MRK', 'https://images.crunchbase.com/image/upload/c_lpad,f_auto,q_auto:eco,dpr_1/v1484319228/r5dfop9wrdxrsbkflim9.png', 'Healthcare');
INSERT INTO stocklist VALUES('TMO', 'https://logowik.com/content/uploads/images/c4999.jpg', 'Healthcare');
INSERT INTO stocklist VALUES('DHR', 'https://images.stockopedia.com/security_images/danaher-nyq-dhr.jpeg', 'Healthcare');
INSERT INTO stocklist VALUES('PFE', 'https://assets-global.website-files.com/63f6e52346a353ca1752970e/644fb7a6db6038e91b578285_20230501T1259-45a566b5-99e6-49bb-b3c6-7b0d2831c1e3.jpeg', 'Healthcare');
INSERT INTO stocklist VALUES('ABT', 'https://images.forbes.com/media/lists/companies/abbott-laboratories_416x416.jpg', 'Healthcare');
INSERT INTO stocklist VALUES('SNY', 'https://1000logos.net/wp-content/uploads/2020/09/Logo-Sanofi.jpg', 'Healthcare');

INSERT INTO stocklist VALUES('BRK.B', 'https://s3-symbol-logo.tradingview.com/berkshire-hathaway--600.png', 'Financial');
INSERT INTO stocklist VALUES('V', 'https://media.licdn.com/dms/image/C560BAQEP8_eM4zW8bw/company-logo_200_200/0/1626865473807/visa_logo?e=2147483647&v=beta&t=f65j2dH6-pYwjrL3vXige6b9ZXAG4-jXH3w_Bi5eMFg', 'Financial');
INSERT INTO stocklist VALUES('JPM', 'https://media.licdn.com/dms/image/C4E0BAQFN7ZGRjNcgeA/company-logo_200_200/0/1656681489088/jpmorganchase_logo?e=2147483647&v=beta&t=E2OHp0gjkA_a37j5bvetGRMeiuhubVwjD-cEENIpZ7o', 'Financial');
INSERT INTO stocklist VALUES('MA', 'https://www.investopedia.com/thmb/F8CKM3YkF1fmnRCU2g4knuK0eDY=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/MClogo-c823e495c5cf455c89ddfb0e17fc7978.jpg', 'Financial');
INSERT INTO stocklist VALUES('BAC', 'https://images.crunchbase.com/image/upload/c_lpad,h_256,w_256,f_auto,q_auto:eco,dpr_1/v1488030279/fkmjioyl8kk3g02p71ii.png', 'Financial');
INSERT INTO stocklist VALUES('WFC', 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Wells_Fargo_Bank.svg/2048px-Wells_Fargo_Bank.svg.png', 'Financial');
INSERT INTO stocklist VALUES('HDB', 'https://s3-symbol-logo.tradingview.com/hdfc-bank--600.png', 'Financial');
INSERT INTO stocklist VALUES('HSBC', 'https://logowik.com/content/uploads/images/hsbc-private-bank2406.jpg', 'Financial');
INSERT INTO stocklist VALUES('RY', 'https://manotickvillage.com/wp-content/uploads/2013/03/RBC-logo.jpg', 'Financial');
INSERT INTO stocklist VALUES('MS', 'https://pbs.twimg.com/profile_images/1631347869687898142/ATwo7QZZ_400x400.jpg', 'Financial');

--insert stocks
INSERT INTO stocks VALUES('XOM', 'Exxon Mobil Corp', 105.60);
INSERT INTO stocks VALUES('CVX', 'Chevron Corporation', 146.21);
INSERT INTO stocks VALUES('SHEL', 'Shell PLC', 66.51);
INSERT INTO stocks VALUES('NEE', 'NextEra Energy Inc', 56.82);
INSERT INTO stocks VALUES('SPWR', 'SunPower Corp', 4.10);
INSERT INTO stocks VALUES('TTE', 'TotalEnergies SE', 66.72);
INSERT INTO stocks VALUES('LNG', 'Cheniere Energy, Inc.', 166.25);
INSERT INTO stocks VALUES('BEP', 'Brookfield Renewable Partners LP', 21.41);
INSERT INTO stocks VALUES('COP', 'ConocoPhilips', 117.69);
INSERT INTO stocks VALUES('ENG', 'ENGlobal Corp', 0.28);

--insert diffs
INSERT INTO diffs VALUES('XOM', -2.56, -5.05, -12.62, -1.34);
INSERT INTO diffs VALUES('CVX', -5.86, -14.83, -16.28, -18.12);
INSERT INTO diffs VALUES('SHEL', 0.36, -1.82, 2.31, 18.65);
INSERT INTO diffs VALUES('NEE', -1.68, 10.27, -5.64, -32.51);
INSERT INTO diffs VALUES('SPWR', -4.46, -18.60, -33.82, -76.32);
INSERT INTO diffs VALUES('TTE', 1.50, 0.63, 0.63, 8.45);
INSERT INTO diffs VALUES('LNG', -0.98, -2.74, 0.44, 18.26);
INSERT INTO diffs VALUES('BEP', -1.91, 0.99, -10.03, -17.01);
INSERT INTO diffs VALUES('COP', -1.03, -4.76, -4.89, 3.49);
INSERT INTO diffs VALUES('ENG', 2.08, -4.84, -13.24, -60.67);

--insert watchlist
INSERT INTO watchlist VALUES('bobby', 'CVX');
INSERT INTO watchlist VALUES('bobby', 'NEE');
INSERT INTO watchlist VALUES('bobby', 'COP');
INSERT INTO watchlist VALUES('bobby', 'SPWR');
INSERT INTO watchlist VALUES('bobby', 'MS');

--insert portfolio
INSERT INTO portfolio VALUES('bobby', 'XOM');
INSERT INTO portfolio VALUES('bobby', 'ENG');

INSERT INTO portfolio VALUES('maddy', 'CVX');
INSERT INTO portfolio VALUES('maddy', 'NEE');
INSERT INTO portfolio VALUES('maddy', 'COP');
INSERT INTO portfolio VALUES('maddy', 'SPWR');

--insert mock purchases
INSERT INTO purchases VALUES(1, 'bobby', 'XOM', 86.23, 1000, 0);
INSERT INTO purchases VALUES(2, 'bobby', 'ENG', 0.20, 1000, 0);
INSERT INTO purchases VALUES(3, 'bobby', 'CVX', 147.1, 100, 1);

INSERT INTO purchases VALUES(4, 'maddy', 'CVX', 163.1, 100, 0);
INSERT INTO purchases VALUES(5, 'maddy', 'NEE', 61.20, 100, 0);
INSERT INTO purchases VALUES(6, 'maddy', 'COP', 112.4, 100, 0);
INSERT INTO purchases VALUES(7, 'maddy', 'SPWR', 4.03, 100, 0);

COMMIT;