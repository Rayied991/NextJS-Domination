import Hello from "../components/Hello";

const page = () => {
  console.log("What type of a component a I?");
  return (
    <main>
      <div className="text-5xl underline">
      <h1>Welcome to Next.js!</h1>
    </div>
    <Hello/>
    </main>
  )
}

export default page;