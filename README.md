# News aggregator

This project contains a Restful API wich expose news in a commom response interface from these sources:

- _The New York Times_
- _The Guardian_

[![Watch API Docs](https://dabuttonfactory.com/button.png?t=Check+API+DOCS&f=Open+Sans-Bold&ts=12&tc=fff&hp=34&vp=14&c=11&bgt=unicolored&bgc=15d798)](https://app.swaggerhub.com/apis-docs/JoshRami/News/1.0.0)

---

## Tasks

You are going to build a news aggregator Restful API using The Guardian's and The New York Time's APIs.

- [x] Your API will have a single endpoint to handle searches.
- [x] It should search on both APIs.
- [x] It should expose a filter that is used to search only by 1 news API.
- [x] The Restful API must define a common interface for the responses of the news APIs and both news response payloads must conform to it
- [x] The Restful API must be documented, either using the README.md file, Postman or Swagger.
- [ ] As an extra credit, only one of the two sources should be accessible for unauthenticated users, in order to search from the other one (or both at the same time) the user should be authenticated (using JWT)
