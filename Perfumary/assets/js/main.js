const BaseUrl = "assets/data/";
var url = window.location.href;
let br = UzmiIzLokalStorage("br");

/* FUNKCIJA KOJA STAVLJA ITEMS U LOKAL STORAGE */
function StaviULokalStorage(key, item)
{
    localStorage.setItem(key,(JSON.stringify(item)))
}

/* FUNKCIJA KOJA UZIMA ITEMS IZ LOKAL STORAGE-A */
function UzmiIzLokalStorage(key)
{
    return JSON.parse(localStorage.getItem(key))
}

DohvatiPodatke("brendovi", "get", PrikaziBrendove);
window.onload = function()
{
    DohvatiPodatke("navMeni","get",prikaziNavMeni);
    $("#forma").hide();

    if(url.endsWith("shop.html"))
    {
        ispisListeZaSortiranje();
        DohvatiPodatke("proizvodi", "get", ispisProizvoda)
    }
    osveziKorpu();
    if(url.endsWith("korpa.html"))
    {
        proveraKorpe();
    }
}

/* AJAXCALLBACK */
function DohvatiPodatke(fajl, tip, callback)
{
    $.ajax({
        url : BaseUrl + fajl + ".json",
        method : tip,
        dataType : "json",
        success : function(nizPodataka)
        {
             callback(nizPodataka)
        },
        error : function(xhr)
        {
             console.log(xhr)
        }
    })
}

/* FUNKCIJA ZA ISPISIVANJE NAV-MENIJA */
function prikaziNavMeni(podaci)
{
    let html = "";
    podaci.forEach(strana => {
        html += `<li class="nav-item">
        <a class="nav-link " href="${strana.href}" tabindex="-1" >${strana.naziv}</a>
      </li>`
    });

    $("#dinamickiNavBar").html(html);
    DohvatiPodatke("proizvodi", "get", prikaziKratakSadrzaj);
}

/* FUNKCIJA ZA PRIKAZIVANJE KRATKOG SADRZAJA NA INDEX STRANI */
function prikaziKratakSadrzaj(parfemi)
{
    let html = `<h1 id="uredjivanje" >Some of our most popular products</h1>`;
    for(let i=0; i<3; i++){
        html += `<div class="col-xl-4"> 
        <img src="assets/images/${parfemi[i].slika.src}" width="100%"alt="${parfemi[i].slika.alt}" class="rounded" id="pic" />  
        <div>
          <h3 class="tekstnaslov">
            ${parfemi[i].naziv} - ${IspisiBrend(parfemi[i].brend)}
          </h3>
          <p class="tekst"><a href="shop.html" class="btn btn-primary" >Buy now</a></p>
        </div>
    </div>`
    }
    $("#ispisParfema").html(html)
}

/* FUNKCIJA ZA PROVERU PODATAKA IZ FORME */
$(document).on("click", "#form-submit",function()
{
    let Ime,Prezime,Email,Phone,forma;

    forma = document.querySelector("#contact");
    Email = $("#email");
    Ime = $("#firstname");
    Prezime = $("#lastname");
    Phone = $("#phone");
    br = 0;

var emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
var telefonRegex = /^\d{8,13}$/;
var nameRegex =  /^[A-ZČĆŽŠĐ][a-zčćžš]{2,15}$/
var tekstValid = 1;
// telefon
    

    if(Phone.val() == ''){
        Phone.addClass("greska");
        Phone.removeClass("dobro");
        Phone.val("");
        Phone.attr('placeholder','Phone can not be empty');
        tekstValid = 0;
    }
    else if(!telefonRegex.test(Phone.val())){
        Phone.removeClass("dobro");
        Phone.addClass("greska");
        Phone.val("");
        Phone.attr('placeholder','Please provide number between 8 and 13 digits');
        tekstValid = 0;
    }
    else {
        Phone.attr('placeholder','Your phone...');
        Phone.addClass("dobro");
    }
    
    //za text polje
    var tekstPolje =$("#message");

    if(tekstPolje.val() == ''){
        tekstPolje.removeClass("dobro");
        tekstPolje.addClass("greska");
        tekstPolje.val("");
        tekstPolje.attr('placeholder','You can not send empty message');
        tekstValid = 0;
    }
    else {
        tekstPolje.addClass("dobro");
        tekstPolje.attr('placeholder','Your message...');
    }

    //za email 
    if(Email.val() == ''){
        Email.addClass("greska");
        Email.removeClass("dobro");
        Email.val("");
        Email.attr('placeholder','Email adress can not be empty');
        tekstValid = 0
    }
    else if(!emailRegex.test(Email.val())){
        Email.removeClass("dobro");
        Email.addClass("greska");
        Email.val("");
        Email.attr('placeholder','e.g. aleksandar14@gmail.com');
        tekstValid = 0
    }
    else {
        Email.attr('placeholder','Your email...');
        Email.addClass("dobro");
    }
    
    //firstname 
    if(Ime.val() == ''){
        Ime.addClass("greska");
        Ime.removeClass("dobro");
        Ime.val("");
        Ime.attr('placeholder','First name can not be empty');
        tekstValid = 0;
    }

    else if(!nameRegex.test(Ime.val())){
        Ime.removeClass("dobro");
        Ime.addClass("greska");
        Ime.val("");
        Ime.attr('placeholder','Please provide a valid first name, must be between 2-12 characters');
        tekstValid = 0;
    }
    else {
        Ime.attr('placeholder','Your first name...');
        Ime.addClass("dobro");
        Ime.removeClass("greska")
    }


    //lastname 
    if(Prezime.val() == ''){
        Prezime.addClass("greska");
        Prezime.removeClass("dobro");
        Prezime.val("");
        Prezime.attr('placeholder','Last name can not be empty');
        tekstValid = 0;
    }
    else if(!nameRegex.test(Prezime.val())){
        Prezime.removeClass("dobro");
        Prezime.addClass("greska");
        Prezime.val("");
        Prezime.attr('placeholder','Please provide a valid last name, must be between 2-12 characters');
        tekstValid = 0;
    }
    else {
        Prezime.attr('placeholder','Your last name...');
        Prezime.removeClass("greska")
        Prezime.addClass("dobro");
    }



    if(tekstValid == 1)
    {
        $("#forma").show();
        forma.reset();
    }else
    {
        $("#forma").hide();
    }

})

/* FUNKCIJA ZA ISPIS KATEGORIJA PROIZVODA */
function KategorijeParfema(kategorije)
{
    var html="";
    let SveKat = UzmiIzLokalStorage("kategorije");

    var vrednost=SveKat.filter(k=>kategorije.includes(k.id));
    vrednost.forEach((vr,index) =>{

        if(index==vrednost.length-1){
            return html+=vr.naziv;
        }
        else{
            return html+=vr.naziv+", ";
        }
    });
    return html;
    
}

/* FUNKCIJA ZA ISPIS KATEGORIJA */
function ispisKategorija(kategorije)
{
    let html = "";
    kategorije.forEach(kat => { 
        html += `<div class="form-check boja border">
        <input class="form-check-input kategorije" type="checkbox" value="${kat.id}" name="kategorije">
        <label class="form-check-label" for="">${kat.naziv}</label>
        </div>`;
    });
    $("#ispisKategorija").html(html);

    StaviULokalStorage("kategorije",kategorije)
}

/* FUNKCIJA ZA ISPIS BRENDOVA */
function PrikaziBrendove(brendovi)
{
    let html = ``;
    brendovi.forEach(br => {
        html += `<div class="form-check boja border">
        <input class="form-check-input brendovi" type="checkbox" value="${br.id}" name="brendovi">
        <label class="form-check-label" for="${br.id}">${br.naziv}</label>
        </div>`;
    });

    StaviULokalStorage("brendovi",brendovi)
    $("#ispisFiltera").html(html);
    DohvatiPodatke("pol", "get", IspisPola)
}

/* FUNCKIJA ZA ISPIS PROIZVODA */
function ispisProizvoda(proizvodi){
    StaviULokalStorage("proizvodi",proizvodi);
    let html = "";

    proizvodi = filterByBrend(proizvodi);
    proizvodi = FiltriranjePoKategorijama(proizvodi);
    proizvodi = sortParfemi(proizvodi);
    proizvodi = filterByGender(proizvodi);

    if(proizvodi == "")
    {
        $("#p").html('<p class="text-center alert alert-danger">There is no products for selected category</p>');
    }else
    {
        $("#p").html("");
        for(let proizvod of proizvodi){
            html += `   
            <div class="col-12 col-sm-6 col-lg-3 mb-3">
                    <figure class="figure d-flex flex-column align-content-end">
                        <img src="assets/images/${proizvod.slika.src}" class="figure-img img-fluid h-100 rounded visina" alt="${proizvod.slika.alt}">
                        <figcaption class="figure-caption text-dark">
                            <h3 class="m-0">${proizvod.naziv}</h3>
                            <h5>${proizvod.Novo ? "<p style =' color:red'>New!</p>" : ""}</h5>
                            <p class="mt-2">${PrikazZvezdica(proizvod.rating)}</p>
                            <p>By: ${IspisiBrend(proizvod.brend)}</p>
                            <p>${KategorijeParfema(proizvod.kategorije)}</p>
                            <h4 class="font">${proizvod.volume}</h4>
                            <h5 ${proizvod.Shipping.canShip ? "style='color : green'> In Stock!" : " style ='color : red' > Not in Stock!"}</h5>
                            <div class="text-center font"> 
                            <h5> $${proizvod.cena.trenutna}.00</h5>
                            <s>${proizvod.cena.PrePopusta ? "$"+proizvod.cena.PrePopusta+".00" : " "}</s>
                            </div>
                        </figcaption>
                    </figure> 
                <button class="btn btn-dark bojaShimmer mb-3 d-block mx-auto btnKorpaDodaj" data-idkorpa="${proizvod.id}">
                    <i class="fas fa-shopping-cart me-2"></i>Dodaj u korpu
                </button>
            </div>`
    }}

    StaviULokalStorage("proizvodi",proizvodi);
    $("#ispisProizvoda").html(html);
    $(".btnKorpaDodaj").click(dodajUKorpu);
}

function dodajUKorpu()
{
    let id = $(this).data('idkorpa');
    let CartProducts = UzmiIzLokalStorage("proizvodiCart");
    if(CartProducts)
    {
        if(productAlreadyInCart())
        {      
            M.toast({html: 'Perfume is already in cart!'})
        }else
        {
            M.toast({html : "Perfume added to cart"});
            addToLocalStorage();
        }
    }else
    {
        prviPriozvodUKorpi();
    }
    function prviPriozvodUKorpi()
    {
        let products = [];
        products[0] = {
            id : id,
            quantity : 1
        };
        StaviULokalStorage("proizvodiCart", products);
    }
    function productAlreadyInCart()
    {
        let proizvodiIzCart = UzmiIzLokalStorage("proizvodiCart");
        for (let proizvod of proizvodiIzCart) {
            if(id == proizvod.id)
            {
                return 1;
            }
        }
    }   
    function addToLocalStorage()
    {
        let productsFromLS = UzmiIzLokalStorage("proizvodiCart");
        productsFromLS.push({
            id : id,
            quantity : 1
        });
        StaviULokalStorage("proizvodiCart", productsFromLS);
    }
}
/* FUNKCIJA ZA ISPIS OCENE PROIZVODA */
function PrikazZvezdica(zvezdice)
{
    let html = "";

    for(let i = 0; i < 5; i++)
    {
        if(i < zvezdice)
        {
            html += `<i class="fa fa-star" style="font-size:24px"></i>`;
        }else
        {
            html += `<i class="fa fa-star-o" style="font-size:24px"></i>`;
        }
    }
    return html;
}

/* FUNKCIJA ZA PRIKAZIVANJE BRENDA PROIZVODA */
function IspisiBrend(id)
{
    let Brendovi = UzmiIzLokalStorage("brendovi")
    return Brendovi.filter(x => x.id == id)[0].naziv;
}

/* FUNKCIJA ZA ISPIS DDL ZA SORTIRANJE */
function ispisListeZaSortiranje(){
    let html = `<option value="0">Choose</option>
    <option value="asc">Price Accending</option>
    <option value="dsc">Price Descending</option>
    <option value="a-z">Name A-Z</option>
    <option value="z-a">Name Z-A</option>
    <option value="new">Newest</option>`;
    $(".ispisiSort").html(html);
}

/* FUNKCIJA ZA ISPIS POL-A */
function IspisPola(polovi)
{
    let html = "";
    polovi.forEach(pol => { 
        html += `<div class="form-check boja border">
        <input class="form-check-input polovi" type="checkbox" value="${pol.id}" name="polovi">
        <label class="form-check-label" for="${pol.id}">${pol.pol}</label>
        </div>`;
    });
    $("#ispisPolova").html(html);

    DohvatiPodatke("kategorije", "get", ispisKategorija);
}

/* FUNKCIJA ZA FILTRIRANJE PO KATEGORIJAMA */
function FiltriranjePoKategorijama(proizvodi) {
    let chosenCategoryIds = [];
    let chosenCategories = document.querySelectorAll('input[name="kategorije"]:checked');
    chosenCategories.forEach(kategorija => {
        chosenCategoryIds.push(Number(kategorija.value))
    })

    if(chosenCategoryIds.length) {
        return proizvodi.filter(proizvod => 
            proizvod.kategorije.some(kategorija => 
                chosenCategoryIds.includes(kategorija)    
            ) 
        )
    }
    
    return proizvodi;
}

/*FUNKCIJA ZA FILTRIRANJE PO BRENDOVIMA */
function filterByBrend(proizvodi) {
    let chosenBrandIds = []
    let chosenBrands = document.querySelectorAll('input[name="brendovi"]:checked')
    chosenBrands.forEach(brend => {
        chosenBrandIds.push(Number(brend.value))
    })

    if(chosenBrandIds.length) {
        return proizvodi.filter(proizvod => 
            chosenBrandIds.includes(proizvod.brend)    
        )
    }
    
    return proizvodi
}

/*FUNKCIJA ZA FILTRIRANJE PO POL-U */
function filterByGender(proizvodi) {
    let ChosenGenderIds = []
    let chosenGenders = document.querySelectorAll('input[name="polovi"]:checked')
    chosenGenders.forEach(gender => {
        ChosenGenderIds.push(Number(gender.value))
    })
    if(ChosenGenderIds.length) {
        return proizvodi.filter(proizvod => 
            ChosenGenderIds.includes(proizvod.pol)    
        )
    }
    
    return proizvodi
}

/* FUNKCIJA ZA SORTIRANJE */
if(url.endsWith("shop.html"))
{
    function sortParfemi(proizvodi) {
        let sortType = document.getElementById('ddlSortiraj').value;
        switch(sortType) {
            case 'z-a': 
                    return proizvodi.sort((previous, next) =>
                        previous.naziv < next.naziv ? 1 : -1
                    )
            case 'asc': 
                    return proizvodi.sort((previous, next) =>
                    Number(previous.cena.trenutna) > Number(next.cena.trenutna) ? 1 : -1
                    )
            case 'dsc': 
                    return proizvodi.sort((previous, next) =>
                    Number(previous.cena.trenutna) < Number(next.cena.trenutna) ? 1 : -1
                    )
            case 'a-z': 
                    return proizvodi.sort((previous, next) =>
                        previous.naziv > next.naziv ? 1 : -1
                    )
            case 'new':
                    return proizvodi.sort((previous,next) =>
                    previous.Novo < next.Novo ? 1 : -1
                    )
            default :
                    return proizvodi
        }
}
}

/* FUNKCIJA ZA SEARCH */
$(document).on("keyup","#inputSearch", function(){
    let upisano = $(this).val();
    let filtriranoPoUpisu = [];
    let proizvodiPoKat = UzmiIzLokalStorage("proizvodi")

    if(proizvodiPoKat){
        filtriranoPoUpisu = proizvodiPoKat.filter(p => p.naziv.toLowerCase().indexOf(upisano.toLowerCase()) != -1);
    }
    else{
        filtriranoPoUpisu = objProizvodi.filter(p => p.naziv.toLowerCase().indexOf(upisano.toLowerCase()) != -1);
    }
    if(upisano == "")
    {
        DohvatiPodatke("proizvodi","get",ispisProizvoda);
    }
    if(filtriranoPoUpisu.length == 0){
        $("#ispisProizvoda").html('"');
        $("#p").html('<p class="text-center alert alert-danger">There is no products by that name</p>');
    }
    else{
        $("#p").html("");
        ispisProizvoda(filtriranoPoUpisu);
    }
})

/* FUNKCIJA ZA POZIVANJE FILTERA */
if(url.endsWith("shop.html"))
{
    $(document).on("change", function()
    {
        DohvatiPodatke("proizvodi", "get", ispisProizvoda)
    })
}


function proveraKorpe(){
    let korpa = UzmiIzLokalStorage("proizvodiCart");
    let brojProizvodaUKorpi;
    if(korpa){
        brojProizvodaUKorpi = korpa.length;
    }
    if(brojProizvodaUKorpi){
        ispisiProizvodeIzKorpe();
        $("#dodatno").show();
    }
    else{
        obavestenjeKorpa();
        $("#dodatno").hide();
    }
    osveziKorpu();
}

function obavestenjeKorpa(){
    let html = `<div class="col-6 mx-auto">
        <p class="bg-dark bojaShimmer text-center p-2 rounded">Trenutno nema proizvoda u korpi!</p>
        <div class="d-grid gap-2">
            <a href="shop.html" class="btn btn-light"><i class="fas fa-angle-double-left bojaShimmer me-2"></i>Nastavi sa kupovinom </a>
        </div>
    </div>`;
    $("#rezultatKorpa").html(html);
}

function osveziKorpu()
{
    var proizvodi = UzmiIzLokalStorage("proizvodiCart");
    let brojProizvodaUKorpi;
    if(proizvodi){
        brojProizvodaUKorpi = proizvodi.length;
    }
    console.log(brojProizvodaUKorpi)
    if(brojProizvodaUKorpi){  
        $("#KorpaBr").html(`<span class="fas fa-shopping-cart pe-2 ms-2 ms-2" ></span>${brojProizvodaUKorpi}`);
    }
    else{
        $("#KorpaBr").html(`<span class="fas fa-shopping-cart pe-2 ms-2 ms-2" ></span>`);
    }
}

$(document).on("click", ".btnKorpaDodaj" ,osveziKorpu);

function ispisiProizvodeIzKorpe(){
    let tabela = ` <div class="table-responsive">
    <table class="table" id="tabelaProizvodiKorpa">
                        <thead>
                            <tr>
                            <th scope="col">#</th>
                            <th scope="col">Proizvod</th>
                            <th scope="col"></th>
                            <th scope="col">Količina</th>
                            <th scope="col">Cena</th>
                            <th scope="col"></th>
                            </tr>
                        </thead>
                        <tbody>`;
                        tabela += ispis();
    tabela += `</tbody></table></div>`;
    $("#rezultatKorpa").html(tabela);
}

function ispis(){
    let korpa = UzmiIzLokalStorage("proizvodiCart");
    var idProizvoda, kolicinaProizvoda, proizvod;
    
    let html = "";
    let rb = 1;
    for(let k of korpa){
        let UkupanIznos = 0 ;
        idProizvoda = k.id;
        kolicinaProizvoda = k.quantity;
        if(kolicinaProizvoda > 1){
            $(".smanji").show();
        }
        let objProizvodi = UzmiIzLokalStorage("proizvodi")
        proizvod = objProizvodi.filter(el => el.id == idProizvoda);
        for(let p of proizvod){
            html += `<tr>
                            <th scope="row">${rb}</th>
                            <td id="slika">
                                <img src="assets/images/${p.slika.src}" width="88.391px" height = "133px" alt="${p.opis}">
                            </td>
                            <td class="text-center">${p.naziv}</td>
                            <td>${kolicinaProizvoda}</td>
                            <td id="cena" class="text-center">${p.cena.trenutna}</td>
                            <td class="bojaShimmer"><i class="fas fa-trash-alt" id="obrisiIzKorpe" data-id=${p.id}></i></td>
                        </tr>`;
            rb++;
            UkupanIznos += Number(p.cena.trenutna);
        }
        console.log(UkupanIznos)
        ukupnaCena((UkupanIznos))
    }
    return html;
}

$(document).on("click", "#obrisiIzKorpe", function(){
    let id = $(this).data("id");
    let proizvodi = UzmiIzLokalStorage("proizvodiCart");
    let vratiUStorage = proizvodi.filter(el => el.id != id);
    console.log(vratiUStorage);
    StaviULokalStorage("proizvodiCart", vratiUStorage);

    proveraKorpe();
})

var zbir = 0;
function ukupnaCena(ukupnaCena){
    zbir += ukupnaCena;
    console.log(zbir)
    let dostava = obradiDostavu(zbir);
    let prikazi = `${prikazCena(zbir)}`;
    $("#ukupanIznos").html(prikazi);
    ukupanIznosPorudzbine(zbir, dostava);
    StaviULokalStorage("sveUkupno", zbir);
}

function obradiDostavu(ukupnaCena){
    let ispis = "";
    let dostava = 0;
    dostava += 5;
    ispis += `${prikazCena(dostava)}`;
    $("#dostava").html(ispis);
    return dostava;
}
function ukupanIznosPorudzbine(zbir,dostava){
    var sveUkupno = zbir + dostava;
    let prikazi = `${prikazCena(sveUkupno)}`;
    $("#ukupno").html(prikazi);
    StaviULokalStorage("iznosPorudzbine", sveUkupno);
}

function prikazCena(cena){
    let zaokruzenaCena = cena.toFixed(2);
    return "$" + zaokruzenaCena;
}







