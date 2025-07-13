const http= require('http')
const https= require('https')
const url= require('url')
const dotenv= require('dotenv')
dotenv.config();

const server= http.createServer((req,res)=>{
    const parsed= url.parse(req.url, true);

    if(req.method==='GET' && parsed.pathname==='/'){
        res.writeHead(200,{'Content-Type': 'application/json'})
        res.end(JSON.stringify({Message:'Welcome to the Movie API',
            usage: 'Use /movie?title=MovieName to get movie info',
            example: '/movie?title=Interstellar'
        }))

    }
    if(req.method==='GET'&& parsed.pathname==='/movie'){
            const title= parsed.query.title;

            if(!title){
                res.writeHead(400, {"Content-Type":'application/json'})
                res.end(JSON.stringify({error:'Give the movie title'}))
                return;
            }

            const apiKey=process.env.OMDB_API_KEY;
            const apiUrl=`https://www.omdbapi.com/?t=${encodeURIComponent(title)}&apikey=${apiKey}`;

            https.get(apiUrl, (apiRes)=>{
                let body= '';

                apiRes.on('data', (chunk)=>{
                     body+=chunk;
                })

            apiRes.on('end', ()=>{
                    try{
                    const movie= JSON.parse(body)

                     if (movie.Response === 'False') {
                    res.writeHead(404, { 'Content-Type': 'application/json' });
                     res.end(JSON.stringify({ error: movie.Error }));
                    return;
                    }

                    const result={
                        title:movie.Title,
                        plot:movie.Plot,
                        type:movie.Type,
                        year:movie.Year,
                        rating:movie.imdbRating
                    }
 
                    res.writeHead(200, {'Content-Type':'application/json'})
                    res.end(JSON.stringify(result))
                    }
                     catch(err){
                        res.writeHead(404, {'Content-Type':'application/json'})
                        res.end(JSON.stringify({'error':'Invalid movie credentials'}))
                    }
                })
            }).on('error',(err)=>{
                res.writeHead(500,{"Content-Type":'Application/json'})
                res.end(JSON.stringify({error: 'Error on calling API'}))
            })
        }

            return;
        }
      

    
)

const PORT=3002;

server.listen(PORT, ()=>{
    console.log(`The website is at http://localhost:${PORT}`)
})