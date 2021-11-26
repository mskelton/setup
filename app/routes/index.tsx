import { Link } from "react-router-dom"
import type { LinksFunction, LoaderFunction, MetaFunction } from "remix"
import { useLoaderData } from "remix"
import * as wasm from "../../wasm/pkg/setup_bg"
import stylesUrl from "../styles/index.css"

export const meta: MetaFunction = () => {
  return {
    description: "Welcome to remix!",
    title: "Remix Starter",
  }
}

export const links: LinksFunction = () => {
  return [{ href: stylesUrl, rel: "stylesheet" }]
}

export const loader: LoaderFunction = async () => {
  return { message: "this is awesome 😎" }
}

export default function Index() {
  const data = useLoaderData()

  return (
    <div style={{ padding: 20, textAlign: "center" }}>
      <h2>Welcome to Remix!</h2>
      <p>
        <a href="https://docs.remix.run">Check out the docs</a> to get started.
      </p>
      <p>Message from the loader: {data.message}</p>
      <p>
        <Link to="not-found">Link to 404 not found page.</Link> Clicking this
        link will land you in your root CatchBoundary component.
      </p>
    </div>
  )
}
