(async ()=>{ 

    console.log('a'); 

    (async ()=>{ 

        console.log('b'); 

        (async ()=>{ 

            console.log('c'); 

            console.log('d'); 

        })();

        await new Promise((resolve) => setTimeout(() => {console.log(`async end`);resolve()}, 1000));

        console.log('e'); 

    })();

    console.log('f'); 

})();
