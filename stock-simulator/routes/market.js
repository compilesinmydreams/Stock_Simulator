const express = require('express');
const router = express.Router();

const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database('./db/stock-simulator.db', err=>{
  if(err)
    return console.error(err.message);
  
  
})

const trending = [
  {category: 'Energy', stocks: [
    {symbol: 'XOM', img: 'https://logodix.com/logo/268321.png'},
    {symbol: 'CVX', img: 'https://media.designrush.com/inspiration_images/134801/conversions/_1511456381_693_chevron-preview.jpg'},
    {symbol: 'SHEL', img: 'https://upload.wikimedia.org/wikipedia/en/thumb/e/e8/Shell_logo.svg/1200px-Shell_logo.svg.png'},
    {symbol: 'NEE', img: 'https://thumbor.forbes.com/thumbor/fit-in/600x300/https://www.forbes.com/advisor/wp-content/uploads/2022/06/og-logo-removebg-preview.png'},
    {symbol: 'SPWR', img: 'https://g.foolcdn.com/art/companylogos/square/spwr.png'},
    {symbol: 'TTE', img: 'https://s3-symbol-logo.tradingview.com/total--600.png'},
    {symbol: 'LNG', img: 'https://www.marketbeat.com/logos/cheniere-energy-partners-lp-logo.png?v=20230815112904'},
    {symbol: 'BEP', img: 'https://images.crunchbase.com/image/upload/c_lpad,h_256,w_256,f_auto,q_auto:eco,dpr_1/ftywp0uqny4wpkpvnxmx'},
    {symbol: 'COP', img: 'https://yt3.googleusercontent.com/DMPr_bb-XvbmUjmksiI9ulnoYgl0yrBvNmt-XqjkCVgu1Ud8arqRLHCoPArvK_ypZibX0xILlsg=s900-c-k-c0x00ffffff-no-rj'},
    {symbol: 'ENG', img: 'https://s3-symbol-logo.tradingview.com/englobal-corporation--600.png'},
  ]},
  {category: 'Materials', stocks: [
    {symbol: 'LIN', img: 'https://static.stocktitan.net/company-logo/LIN-lg.png'},
    {symbol: 'BHP', img: 'https://pbs.twimg.com/profile_images/863828491464130564/ELuG-2o6_400x400.jpg'},
    {symbol: 'SHW', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLjpfoIhMlq-oXo5xQtLHuD_4dPOJmKTsDow&usqp=CAU'},
    {symbol: 'APD', img: 'https://s3-symbol-logo.tradingview.com/air-products-and-chemicals--600.png'},
    {symbol: 'VALE', img: 'https://miningafrica.net/wp-content/uploads/2020/12/Vale-logo-2.jpg'},
    {symbol: 'SCCO', img: 'https://is1-ssl.mzstatic.com/image/thumb/Purple116/v4/49/d4/c8/49d4c813-8138-d3e7-d58d-52debd05ccef/AppIconARKANSAS-0-0-1x_U007emarketing-0-0-0-10-0-0-sRGB-0-0-0-GLES2_U002c0-512MB-85-220-0-0.png/1200x630wa.png'},
    {symbol: 'FCX', img: 'https://s3-symbol-logo.tradingview.com/freeport-mcmoran--600.png'},
    {symbol: 'RIO', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOFkIuQt19IMeQXBiyVDwofnhuQh2VTWWjiQ&usqp=CAU'},
    {symbol: 'ECL', img: 'https://companieslogo.com/img/orig/ECL-b417c4a1.png?t=1654489788'},
    {symbol: 'CRH', img: 'https://upload.wikimedia.org/wikipedia/en/a/ac/CRH_logo.svg'}
  ]},
  {category: 'Industrial', stocks: [
    {symbol: 'CAT', img: 'https://wallpaperaccess.com/full/3579410.png'},
    {symbol: 'UPS', img: 'https://www.puzzelpuzzels.nl/imatjes/528a4e2ab51b2-p.jpg'},
    {symbol: 'UNP', img: 'https://www.american-rails.com/images/087NN1760KLP09167GG615716.jpg'},
    {symbol: 'HON', img: 'https://d1yjjnpx0p53s8.cloudfront.net/styles/logo-thumbnail/s3/122015/untitled-1_66.png?itok=WxKDQdNQ'},
    {symbol: 'GE', img: 'https://i.pinimg.com/736x/5e/fd/81/5efd81abd37a724a82e7f46ea6e1bc95.jpg'},
    {symbol: 'BA', img: 'https://d1yjjnpx0p53s8.cloudfront.net/styles/logo-thumbnail/s3/102014/boeinglogo.png?itok=1H1JUfJc'},
    {symbol: 'DE', img: 'https://static.stocktitan.net/company-logo/DE-lg.png'},
    {symbol: 'RTX', img: 'https://media.zenfs.com/en/us.finance.gurufocus/cb49ba262b0d4274fac397195c7d1730'},
    {symbol: 'FDX', img: 'https://cdn.benzinga.com/files/imagecache/1024x768xUP/images/story/2023/09/11/fdx_1.png'}
  ]},
  {category: 'Healthcare', stocks: [
    {symbol: 'LLY', img: 'https://cdn.worldvectorlogo.com/logos/lilly-1.svg'},
    {symbol: 'UNH', img: 'https://d1yjjnpx0p53s8.cloudfront.net/styles/logo-thumbnail/s3/062011/unitedhealth-group.png?itok=8Uli1Sqm'},
    {symbol: 'NVO', img: 'https://media.licdn.com/dms/image/D4E0BAQEHDDS3zgV1eg/company-logo_200_200/0/1688197985925/novo_nordisk_logo?e=2147483647&v=beta&t=-MHx6EjRyvRwMSb13PuMBHOXM5XjqIhRUoj1-h6gn4s'},
    {symbol: 'JNJ', img: 'https://invest-brands.cdn-tinkoff.ru/US4781601046x640.png'},
    {symbol: 'MRK', img: 'https://images.crunchbase.com/image/upload/c_lpad,f_auto,q_auto:eco,dpr_1/v1484319228/r5dfop9wrdxrsbkflim9.png'},
    {symbol: 'TMO', img: 'https://logowik.com/content/uploads/images/c4999.jpg'},
    {symbol: 'DHR', img: 'https://images.stockopedia.com/security_images/danaher-nyq-dhr.jpeg'},
    {symbol: 'PFE', img: 'https://assets-global.website-files.com/63f6e52346a353ca1752970e/644fb7a6db6038e91b578285_20230501T1259-45a566b5-99e6-49bb-b3c6-7b0d2831c1e3.jpeg'},
    {symbol: 'ABT', img: 'https://images.forbes.com/media/lists/companies/abbott-laboratories_416x416.jpg'},
    {symbol: 'SNY', img: 'https://1000logos.net/wp-content/uploads/2020/09/Logo-Sanofi.jpg'},
  ]},
  {category: 'Financial', stocks: [
    {symbol: 'BRK.B', img: 'https://s3-symbol-logo.tradingview.com/berkshire-hathaway--600.png'},
    {symbol: 'V', img: 'https://media.licdn.com/dms/image/C560BAQEP8_eM4zW8bw/company-logo_200_200/0/1626865473807/visa_logo?e=2147483647&v=beta&t=f65j2dH6-pYwjrL3vXige6b9ZXAG4-jXH3w_Bi5eMFg'},
    {symbol: 'JPM', img: 'https://media.licdn.com/dms/image/C4E0BAQFN7ZGRjNcgeA/company-logo_200_200/0/1656681489088/jpmorganchase_logo?e=2147483647&v=beta&t=E2OHp0gjkA_a37j5bvetGRMeiuhubVwjD-cEENIpZ7o'},
    {symbol: 'MA', img: 'https://www.investopedia.com/thmb/F8CKM3YkF1fmnRCU2g4knuK0eDY=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/MClogo-c823e495c5cf455c89ddfb0e17fc7978.jpg'},
    {symbol: 'BAC', img: 'https://images.crunchbase.com/image/upload/c_lpad,h_256,w_256,f_auto,q_auto:eco,dpr_1/v1488030279/fkmjioyl8kk3g02p71ii.png'},
    {symbol: 'WFC', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Wells_Fargo_Bank.svg/2048px-Wells_Fargo_Bank.svg.png'},
    {symbol: 'HDB', img: 'https://s3-symbol-logo.tradingview.com/hdfc-bank--600.png'},
    {symbol: 'HSBC', img: 'https://logowik.com/content/uploads/images/hsbc-private-bank2406.jpg'},
    {symbol: 'RY', img: 'https://manotickvillage.com/wp-content/uploads/2013/03/RBC-logo.jpg'},
    {symbol: 'MS', img: 'https://pbs.twimg.com/profile_images/1631347869687898142/ATwo7QZZ_400x400.jpg'}
  ]}
]


/**
 * GET request for /market
 * 
 * retrieves the stock information from the user's watchlist
 * renders the market page
 * note: trending stocks are hard coded above
 */
router.get('/', function(req, res, next){
  let username = req.session.username;
    const WATCHLIST_QUERY = "SELECT stocks.symbol, stocks.company, stocks.price FROM watchlist INNER JOIN stocks on stocks.symbol = watchlist.symbol WHERE user_id = ?;"
    db.all(WATCHLIST_QUERY, [username], (err, stocks) => {
      res.render('market.pug', {trending: trending, stocks: stocks});
    })
   
});

module.exports = router;