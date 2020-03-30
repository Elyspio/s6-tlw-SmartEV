import servers from "./server";

servers.back.listen(4000, () => {
	console.log("Listening backend on port ", 4000);
});

servers.front.listen(80, () => {
	console.log("Listening frontend on port ", 80);
});
