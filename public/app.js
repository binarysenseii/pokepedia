
$('body button').click( ()=>{
    const redirectUrl = new URL(window.location.href+ 'pokeinfo');
    const params = new URLSearchParams({pokemon:$('body input').val()});
    redirectUrl.search = params.toString();
    window.location.href = redirectUrl.href;    
} );

if(window.location.pathname=="/pokeinfo")
    pokeinfo();
 
async function pokeinfo(){
    $('#con1').hide();
    const facts=[
        "Pikachu wasn't Pokémon's original mascot.",
        "Rhydon is the 1st Pokémon ever created.",
        "Pikachu and Meowth have opposite Pokédex numbers.",
        "Pikachu was designed after a squirrel.",
        "There's an enzyme named after Pikachu.",
        "Some Pokémon breed both asexually & sexually.",
        "Mew's clone was registered in the Pokédex before Mew."
    ]
    var ran=Math.floor(Math.random() *7);
    $('.conload h4').text(facts[ran]);
    const urlParams = new URLSearchParams(window.location.search);
    const pokemon = urlParams.get('pokemon');
    const response = await fetch('/pokeinfo',
        {
            method:"POST",
            headers:{
                'Content-Type':'application/json'
            },
            body: JSON.stringify({pokemon : pokemon})
        });
        const result= await response.json();
        $('.conload').hide();
        $('#con1').show();
        console.log(result.moveinfo[0].effect_entries[0].effect);
        $('#basinfo h2').text(result.pokeinfo.name);
        $('#basinfo p').eq(0).text($('#basinfo p').eq(0).text()+result.pokeinfo.types.map( type => type.type.name));
        $('#basinfo p').eq(1).text($('#basinfo p').eq(1).text()+result.pokeinfo.base_experience);
        $('#basinfo p').eq(2).text($('#basinfo p').eq(2).text()+result.pokeinfo.abilities.map( ability => ability.ability.name));
        $('#pokeimg img').attr('src',result.pokeinfo.sprites.other.dream_world.front_default);
        setTimeout(() => {
            $('.selector.s').addClass('clicked');
            $('#infopanel').empty().append('<h3>HP:<p></p></h3><h3>Attack:<p></p></ h3><h3>Defense:<p></p></h3><h3>Special Attack:<p></p></h3><h3>Special Defense:<p></p></h3><h3>Speed:<p></p></h3>').addClass('s').removeClass('m'); 
            for(let i=0;i<7;i++)
            $('#infopanel.s h3').eq(i).text($('#infopanel.s h3').eq(i).text()+ result.pokeinfo.stats[i].base_stat); 
        }, 400);
        $('#con1 a').attr('href', window.location.origin)
        $('.selector.s').on('click',(event)=>
            {   
                $('#infopanel').empty().append('<div id="loader" style="display:flex;justify-content: center;align-items: center; height:100%"><img src="/images/pokeball.png" style="height:80px; width:80px;position: relative;" alt=""></div>')
                setTimeout(()=>{
                $('.selector.s').addClass('clicked');
                $('.selector.m').removeClass('clicked');
                $('#infopanel').empty().append('<h3>HP:<p></p></h3><h3>Attack:<p></p></ h3><h3>Defense:<p></p></h3><h3>Special Attack:<p></p></h3><h3>Special Defense:<p></p></h3><h3>Speed:<p></p></h3>').addClass('s').removeClass('m');
                for(let i=0;i<7;i++)
                $('#infopanel.s h3').eq(i).text($('#infopanel.s h3').eq(i).text()+ result.pokeinfo.stats[i].base_stat);
                },400);    
            });
        
        $('.selector.m').on('click',(event)=>   
        { $('#infopanel').empty().append('<div id="loader" style="display:flex;justify-content: center;  align-items: center; height:100%"><img src="images/pokeball.png" style="height:80px; width:80px;position: relative;" alt=""></div>');
                setTimeout(() => {
                    $('.selector.s').removeClass('clicked');
                    $('.selector.m').addClass('clicked');
                    $('#infopanel').empty().addClass('m').removeClass('s');
                    for(let i=0;i<result.pokeinfo.moves.length;i++)
                    {   const movename=result.pokeinfo.moves[i].move.name;
                        const effect =result.moveinfo[i].effect_entries.map(effect => effect.effect.replace("$effect_chance",result.moveinfo[i].effect_chance));
                        $('#infopanel').append('<div class="moves"><h3>'+movename+'</h3><p>'+effect+'</p></div>');   
                    }
                }, 400);
            });
}
    


      


