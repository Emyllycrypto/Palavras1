// ===============================
// ELEMENTOS
// ===============================


const tempo = document.querySelector("#tempo");

const contador = document.querySelector("#contador");

const tema = document.querySelector("#tema");

const grid = document.querySelector("#grid");

const words = document.querySelector("#words");

const level = document.querySelector("#level");

const message = document.querySelector("#message");




// ===============================
// CRONÔMETRO
// ===============================


let segundos = 0;

let timer;



function atualizarTempo() {

    let min = Math.floor(segundos / 60);

    let seg = segundos % 60;


    if (tempo) {

        tempo.innerHTML =
            `${String(min).padStart(2, "0")}:${String(seg).padStart(2, "0")}`;

    }

}




function iniciarCronometro() {

    clearInterval(timer);


    timer = setInterval(() => {


        segundos++;

        atualizarTempo();


    }, 1000);

}





// ===============================
// SOM DE ACERTO
// ===============================


const somAcerto = new Audio(
    "musica/pop.mp3"
);





// ===============================
// MODO NOITE
// ===============================


const darkMode = document.getElementById("darkMode");


if (darkMode) {


    darkMode.addEventListener("change", () => {


        document.body.classList.toggle(
            "dark",
            darkMode.checked
        );


    });


}






// ===============================
// RANKING
// ===============================


function salvarRanking() {


    let melhor =
        localStorage.getItem("melhorTempo");



    if (
        !melhor ||
        segundos < Number(melhor)
    ) {


        localStorage.setItem(
            "melhorTempo",
            segundos
        );


    }


}






// ===============================
// FASES
// ===============================


const fases = [


    {

        nome: "✰ FASE 01 - FÁCIL",

        tamanho: 8,


        palavras: [


            {
                texto: "SORRISO",
                possessivo: "SEU"
            },


            {
                texto: "CHEIRO",
                possessivo: "SEU"
            },


            {
                texto: "CARINHO",
                possessivo: "SEU"
            },


            {
                texto: "CORAGEM",
                possessivo: "SUA"
            }


        ]


    },




    {


        nome: "✰✰ FASE 02 - MÉDIO",

        tamanho: 10,


        palavras: [


            {
                texto: "BONDADE",
                possessivo: "SUA"
            },


            {
                texto: "ABRAÇOS",
                possessivo: "SEUS"
            },


            {
                texto: "TERNURA",
                possessivo: "SUA"
            },


            {
                texto: "CUIDADO",
                possessivo: "SEU"
            },


            {
                texto: "OLHAR",
                possessivo: "SEU"
            }


        ]


    },




    {


        nome: "✰✰✰ FASE 03 - DIFÍCIL",

        tamanho: 12,


        palavras: [


            {
                texto: "FELICIDADE",
                possessivo: "SUA"
            },


            {
                texto: "ESFORÇO",
                possessivo: "SEU"
            },


            {
                texto: "INTELIGÊNCIA",
                possessivo: "SUA"
            },


            {
                texto: "DETERMINAÇÃO",
                possessivo: "SUA"
            },


            {
                texto: "RESILIÊNCIA",
                possessivo: "SUA"
            },


            {
                texto: "DEDICAÇÃO",
                possessivo: "SUA"
            }


        ]


    },





];





// ===============================
// VARIÁVEIS DO JOGO
// ===============================


let faseAtual = 0;


let selecionadas = [];


let encontradas = [];

let arrastando = false;

let letrasSelecionadasTouch = [];


let usandoTouch = false;


const coresPalavras = [


    "#ff6b81",

    "#54a0ff",

    "#1dd1a1",

    "#feca57",

    "#ff9f43",

    "#a29bfe",

    "#00cec9"


];

// ===============================
// INICIAR JOGO
// ===============================


function iniciar() {


    grid.innerHTML = "";

    words.innerHTML = "";

    message.innerHTML = "";



    selecionadas = [];

    encontradas = [];



    const fase = fases[faseAtual];




    // ATIVA MODO SEGREDO

    if (fase.segredo) {

        grid.classList.add("segredo");

    } else {

        grid.classList.remove("segredo");

    }




    level.innerHTML = fase.nome;



    contador.innerHTML =
        `0/${fase.palavras.length}`;




    grid.style.gridTemplateColumns =
        `repeat(${fase.tamanho},1fr)`;





    let letras =
        new Array(
            fase.tamanho * fase.tamanho
        ).fill("");





    // ===============================
    // COLOCAR PALAVRAS
    // ===============================


    fase.palavras.forEach(item => {


        let palavra = item.texto;


        let colocado = false;



        while (!colocado) {



            let horizontal =
                Math.random() < 0.5;



            let linha =
                Math.floor(
                    Math.random() * fase.tamanho
                );



            let coluna =
                Math.floor(
                    Math.random() * fase.tamanho
                );



            let pode = true;




            // HORIZONTAL

            if (horizontal) {



                if (
                    coluna + palavra.length <= fase.tamanho
                ) {


                    for (
                        let i = 0;
                        i < palavra.length;
                        i++
                    ) {


                        let pos =
                            linha * fase.tamanho +
                            coluna + i;



                        if (
                            letras[pos] !== "" &&
                            letras[pos] !== palavra[i]
                        ) {

                            pode = false;

                        }


                    }



                    if (pode) {


                        for (
                            let i = 0;
                            i < palavra.length;
                            i++
                        ) {


                            let pos =
                                linha * fase.tamanho +
                                coluna + i;


                            letras[pos] = palavra[i];


                        }


                        colocado = true;


                    }



                }



            }






            // VERTICAL

            else {



                if (
                    linha + palavra.length <= fase.tamanho
                ) {



                    for (
                        let i = 0;
                        i < palavra.length;
                        i++
                    ) {


                        let pos =
                            (linha + i) * fase.tamanho +
                            coluna;



                        if (
                            letras[pos] !== "" &&
                            letras[pos] !== palavra[i]
                        ) {

                            pode = false;

                        }


                    }





                    if (pode) {



                        for (
                            let i = 0;
                            i < palavra.length;
                            i++
                        ) {


                            let pos =
                                (linha + i) * fase.tamanho +
                                coluna;



                            letras[pos] = palavra[i];


                        }



                        colocado = true;



                    }



                }



            }



        }



    });






    // ===============================
    // COMPLETAR ESPAÇOS
    // ===============================


    for (
        let i = 0;
        i < letras.length;
        i++
    ) {


        if (letras[i] === "") {


            letras[i] = String.fromCharCode(

                65 +
                Math.floor(
                    Math.random() * 26
                )

            );


        }


    }





    // ===============================
    // CRIAR LETRAS
    // ===============================


    letras.forEach(letra => {


        let div =
            document.createElement("div");



        div.className = "letter";



        div.textContent = letra;




        // FASE SEGREDO

        if (fase.segredo) {


            div.dataset.letra = letra;


            div.textContent = "";


        }




        // CLICK NORMAL

        div.addEventListener(
            "click",
            () => {

                selecionarLetra(div);

            }
        );




        // ===============================
        // TOUCH CELULAR
        // ===============================


        div.addEventListener(
            "touchstart",
            (e) => {


                somAcerto.load();


                usandoTouch = true;


                e.preventDefault();


                arrastando = true;


                letrasSelecionadasTouch = [];


                selecionarLetra(div);


                letrasSelecionadasTouch.push(div);


            },
            {
                passive: false
            });


        div.addEventListener(
            "touchmove",
            (e) => {

                e.preventDefault();


                if (!arrastando) return;


                let toque = e.touches[0];


                let elemento =
                    document.elementFromPoint(
                        toque.clientX,
                        toque.clientY
                    );


                if (
                    elemento &&
                    elemento.classList.contains("letter")
                ) {

                    if (
                        !letrasSelecionadasTouch.includes(elemento)
                    ) {

                        selecionarLetra(elemento);

                        letrasSelecionadasTouch.push(elemento);

                    }

                }


            },
            {
                passive: false
            });


        div.addEventListener(
            "touchend",
            () => {

                arrastando = false;


                letrasSelecionadasTouch = [];


            }
        );


        grid.appendChild(div);



    });








    // ===============================
    // LISTA DE PALAVRAS
    // ===============================


    fase.palavras.forEach(item => {


        let span =
            document.createElement("span");



        span.dataset.word =
            item.texto;



        span.innerHTML = `

        <span class="possessivo"></span>

        <strong>?</strong>

        `;



        words.appendChild(span);



    });



}

// ===============================
// SELECIONAR LETRA
// ===============================


function selecionarLetra(letra) {



    // CLICOU DE NOVO REMOVE


    if (selecionadas.includes(letra)) {


        selecionadas =
            selecionadas.filter(
                l => l !== letra
            );


        letra.classList.remove(
            "selected"
        );


        return;


    }





    // ADICIONA LETRA


    selecionadas.push(letra);


    letra.classList.add(
        "selected"
    );







    // MONTA PALAVRA


    let palavra = "";


    selecionadas.forEach(l => {


        if (fases[faseAtual].segredo) {


            palavra += l.dataset.letra;


        } else {


            palavra += l.textContent;


        }


    });








    const fase =
        fases[faseAtual];







    // VERIFICA ACERTO


    let achou =
        fase.palavras.find(item =>


            item.texto === palavra ||


            item.texto ===
            palavra
                .split("")
                .reverse()
                .join("")


        );







    if (achou) {



        tocarAcerto();


        // SOM

        function tocarAcerto() {

            somAcerto.currentTime = 0;

            somAcerto.play()
                .catch(() => { });

        }




        let cor =
            coresPalavras[
            encontradas.length %
            coresPalavras.length
            ];







        // REVELAR FASE SEGREDO


        if (fase.segredo) {


            selecionadas.forEach(l => {


                l.textContent =
                    l.dataset.letra;


            });


        }








        // ANIMAÇÃO DAS LETRAS


        selecionadas.forEach(l => {


            l.classList.remove(
                "selected"
            );


            l.classList.add(
                "found"
            );


            l.classList.add(
                "pop"
            );



            setTimeout(() => {


                l.classList.remove(
                    "pop"
                );


            }, 400);




            l.style.background = cor;


            l.style.color = "#fff";


            l.style.boxShadow =
                `0 0 15px ${cor}`;



        });








        // MOSTRA NA LISTA


        let elemento =
            document.querySelector(
                `[data-word="${achou.texto}"]`
            );



        if (elemento) {



            let nome =
                achou.texto;



            if (nome === "EUTEAMO") {

                nome = "EU TE AMO";

            }



            elemento.innerHTML = `

            <span class="possessivo">
            ${achou.possessivo}
            </span>

            <strong>
            ${nome}
            </strong>

            `;



            elemento.classList.add(
                "done"
            );



            elemento.style.color =
                "#4c2a32";


            elemento.style.fontWeight =
                "bold";



        }







        // GUARDA PALAVRA ENCONTRADA


        if (
            !encontradas.includes(
                achou.texto
            )
        ) {


            encontradas.push(
                achou.texto
            );


            contador.innerHTML =

                `${encontradas.length}/${fase.palavras.length}`;


        }







        selecionadas = [];








        // ===============================
        // FASE COMPLETA
        // ===============================


        if (
            encontradas.length ===
            fase.palavras.length
        ) {



            message.innerHTML =
                "✨ FASE COMPLETA ⟡";





            setTimeout(() => {


                faseAtual++;




                if (
                    faseAtual < fases.length
                ) {


                    iniciar();


                } else {


                    finalizarJogo();


                }



            }, 2000);



        }



    }



}









// ===============================
// FINAL DO JOGO
// ===============================


function finalizarJogo() {


    clearInterval(timer);



    salvarRanking();



    localStorage.setItem(
        "tempoFinal",
        segundos
    );




    window.location.href =
        "final.html";


}








// ===============================
// INICIAR
// ===============================


iniciar();


iniciarCronometro();