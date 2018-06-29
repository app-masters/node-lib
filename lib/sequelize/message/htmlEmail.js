const unsubscribeURL = 'https://outlook.live.com/';
const labelAddress = 'rua da label xd';
const upperText = `<p>Olá João Silva,</p>
<p>Às vezes, você só quer enviar um simples e-mail em HTML com um design simples
    e um apelo à ação claro. É isso.</p>`;
const lowText = `<p>Este é um modelo de email muito simples. Seu único objetivo é fazer com que o
destinatário clique no botão sem distrações.</p>
<p>Boa sorte! Espero que funcione.</p>`;
const actions = [{buttonUrl: 'https://outlook.live.com/', buttonText: 'koe meu truta'}];

// everything bellow this we will hardly ever touch... all above depends on the email that is being sent/the label that is sending it...
const buttonTemplate = `<table border="0" cellpadding="0" cellspacing="0" class="btn btn-primary">
                    <tbody>
                    <tr>
                        <td align="center">
                            <table border="0" cellpadding="0" cellspacing="0">
                                <tbody>
                                <tr>
                                    <td>
                                        <a href="{{buttonUrl}}" target="_blank">{{buttonText}}</a>
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                    </tbody>
                </table>`;

const layout = `<!doctype html>
<html>
<head>
    <meta name="viewport" content="width=device-width"/>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
    <title>Contato - Professor Particular</title>
    <style>
img {
    border: none;
    -ms-interpolation-mode: bicubic;
    max-width: 100%;
}

body {
    background-color: #f6f6f6;
    font-family: sans-serif;
    -webkit-font-smoothing: antialiased;
    font-size: 14px;
    line-height: 1.4;
    margin: 0;
    padding: 0;
    -ms-text-size-adjust: 100%;
    -webkit-text-size-adjust: 100%;
}

table {
    border-collapse: separate;
    mso-table-lspace: 0pt;
    mso-table-rspace: 0pt;
    width: 100%;
}

table td {
    font-family: sans-serif;
    font-size: 14px;
    vertical-align: top;
}

.body {
    background-color: #f6f6f6;
    width: 100%;
}

/* Set a max-width, and make it display as block so it will automatically stretch to that width, but will also shrink down on a phone or something */
.container {
    display: block;
    Margin: 0 auto !important;
    /* makes it centered */
    max-width: 580px;
    padding: 10px;
    width: 580px;
}

/* This should also be a block element, so that it will fill 100% of the .container */
.content {
    box-sizing: border-box;
    display: block;
    Margin: 0 auto;
    max-width: 580px;
    padding: 10px;
}

/* -------------------------------------
    HEADER, FOOTER, MAIN
------------------------------------- */
.main {
    background: #ffffff;
    border-radius: 0 0 3px 3px;
    width: 100%;
}

.wrapper {
    box-sizing: border-box;
    padding: 20px;
}

.content-block {
    padding-bottom: 10px;
    padding-top: 10px;
}

.header {
    padding: 20px;
    background-color: #0074b7;
    border-radius: 3px 3px 0 0;
}

.footer {
    clear: both;
    margin-top: 10px;
    text-align: center;
    width: 100%;
}

.footer td,
.footer p,
.footer span,
.footer a {
    color: #999999;
    font-size: 12px;
    text-align: center;
}

/* -------------------------------------
    TYPOGRAPHY
------------------------------------- */
h1,
h2,
h3,
h4 {
    color: #000000;
    font-family: sans-serif;
    font-weight: 400;
    line-height: 1.4;
    margin: 0;
    margin-bottom: 30px;
}

h1 {
    font-size: 35px;
    font-weight: 300;
    text-align: center;
    text-transform: capitalize;
}

p,
ul,
ol {
    font-family: sans-serif;
    font-size: 14px;
    font-weight: normal;
    margin: 0;
    Margin-bottom: 15px;
}

p li,
ul li,
ol li {
    list-style-position: inside;
    margin-left: 5px;
}

a {
    color: #0074b7;
    text-decoration: underline;
}

/* -------------------------------------
    BUTTONS
------------------------------------- */
.btn {
    box-sizing: border-box;
    width: 100%;
}

.btn > tbody > tr > td {
    padding: 15px 0 30px;
}

.btn table {
    width: auto;
}

.btn table td {
    background-color: #ffffff;
    border-radius: 5px;
    text-align: center;
}

.btn a {
    background-color: #ffffff;
    border: solid 1px #0074b7;
    border-radius: 5px;
    box-sizing: border-box;
    color: #0074b7;
    cursor: pointer;
    display: inline-block;
    font-size: 14px;
    font-weight: bold;
    margin: 0;
    padding: 12px 25px;
    text-decoration: none;
    text-transform: uppercase;
}

.btn-primary table td {
    background-color: #0074b7;
}

.btn-primary a {
    background-color: #0074b7;
    border-color: #0074b7;
    color: #ffffff;
}

/* -------------------------------------
    OTHER STYLES THAT MIGHT BE USEFUL
------------------------------------- */
.last {
    margin-bottom: 0;
}

.first {
    margin-top: 0;
}

.align-center {
    text-align: center;
}

.align-right {
    text-align: right;
}

.align-left {
    text-align: left;
}

.clear {
    clear: both;
}

.mt0 {
    margin-top: 0;
}

.mb0 {
    margin-bottom: 0;
}

.preheader {
    color: transparent;
    display: none;
    height: 0;
    max-height: 0;
    max-width: 0;
    opacity: 0;
    overflow: hidden;
    mso-hide: all;
    visibility: hidden;
    width: 0;
}

.powered-by a {
    text-decoration: none;
}

hr {
    border: 0;
    border-bottom: 1px solid #f6f6f6;
    Margin: 20px 0;
}

/* -------------------------------------
    RESPONSIVE AND MOBILE FRIENDLY STYLES
------------------------------------- */
@media only screen and (max-width: 620px) {
    table[class=body] h1 {
        font-size: 28px !important;
        margin-bottom: 10px !important;
    }

    table[class=body] p,
    table[class=body] ul,
    table[class=body] ol,
    table[class=body] td,
    table[class=body] span,
    table[class=body] a {
        font-size: 16px !important;
    }

    table[class=body] .wrapper,
    table[class=body] .article {
        padding: 10px !important;
    }

    table[class=body] .content {
        padding: 0 !important;
    }

    table[class=body] .container {
        padding: 0 !important;
        width: 100% !important;
    }

    table[class=body] .main {
        border-left-width: 0 !important;
        border-radius: 0 !important;
        border-right-width: 0 !important;
    }

    table[class=body] .btn table {
        width: 100% !important;
    }

    table[class=body] .btn a {
        width: 100% !important;
    }

    table[class=body] .img-responsive {
        height: auto !important;
        max-width: 100% !important;
        width: auto !important;
    }
}

/* -------------------------------------
    PRESERVE THESE STYLES IN THE HEAD
------------------------------------- */
@media all {
    .ExternalClass {
        width: 100%;
    }

    .ExternalClass,
    .ExternalClass p,
    .ExternalClass span,
    .ExternalClass font,
    .ExternalClass td,
    .ExternalClass div {
        line-height: 100%;
    }

    .apple-link a {
        color: inherit !important;
        font-family: inherit !important;
        font-size: inherit !important;
        font-weight: inherit !important;
        line-height: inherit !important;
        text-decoration: none !important;
    }

    .btn-primary table td:hover {
        background-color: #34495e !important;
    }

    .btn-primary a:hover {
        background-color: #34495e !important;
        border-color: #34495e !important;
    }
}
</style>
</head>
<body class="">
<table border="0" cellpadding="0" cellspacing="0" class="body">
    <tr>
        <td>&nbsp;</td>
        <td class="container">
            <div class="content">
                <div class="header align-center">
                    <img src="https://res.cloudinary.com/appmasters-io/image/upload/v1528117556/professor_particular_wyulzk.png"
                         alt="Professor Particular">
                </div>
                <span class="preheader"></span>
                <table class="main">
                    <tr>
                        <td class="wrapper">
                            <table border="0" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td>
                                        {{upperText}}
                                        {{button}}
                                        {{lowText}}
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
                <div class="footer">
                    <table border="0" cellpadding="0" cellspacing="0">
                        <tr>
                            <td class="content-block">
                                <span class="apple-link">{{labelAddress}}</span>
                                <br> Não quer mais receber nossos e-mails? <a href="{{unsubscribeUrl}}">Desinscrever</a>.
                            </td>
                        </tr>
                        <tr>
                            <td class="content-block powered-by">
                                Desenvolvido por App Masters.
                            </td>
                        </tr>
                    </table>
                </div>
            </div>
        </td>
        <td>&nbsp;</td>
    </tr>
</table>
</body>
</html>`;


module.exports = {layout, lowText, upperText, buttonTemplate, actions, unsubscribeURL, labelAddress};