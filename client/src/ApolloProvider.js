import React from 'react'
import App from './App'
import {ApolloClient ,InMemoryCache } from '@apollo/client'
import {createHttpLink} from '@apollo/client'
import {ApolloProvider} from '@apollo/client'

const httpLink = createHttpLink({
    uri: 'http://127.0.0.1:3000/graphql'
})

const client = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache()
})

export default (
    <ApolloProvider client = {client}>
        <App/>
    </ApolloProvider>
)
