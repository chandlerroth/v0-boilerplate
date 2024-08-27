"use client";

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"

const statusCodes = [
  { code: 100, name: "Continue", description: "The server has received the request headers and the client should proceed to send the request body.", category: "Information responses" },
  { code: 101, name: "Switching Protocols", description: "The requester has asked the server to switch protocols and the server has agreed to do so.", category: "Information responses" },
  { code: 102, name: "Processing", description: "A WebDAV request may contain many sub-requests involving file operations, requiring a long time to complete the request.", category: "Information responses" },
  { code: 103, name: "Early Hints", description: "Used to return some response headers before final HTTP message.", category: "Information responses" },
  { code: 200, name: "OK", description: "The request has succeeded.", category: "Successful responses" },
  { code: 201, name: "Created", description: "The request has been fulfilled and a new resource has been created.", category: "Successful responses" },
  { code: 202, name: "Accepted", description: "The request has been accepted for processing, but the processing has not been completed.", category: "Successful responses" },
  { code: 203, name: "Non-Authoritative Information", description: "The server is a transforming proxy that received a 200 OK from its origin, but is returning a modified version of the origin's response.", category: "Successful responses" },
  { code: 204, name: "No Content", description: "The server successfully processed the request and is not returning any content.", category: "Successful responses" },
  { code: 205, name: "Reset Content", description: "The server successfully processed the request, but is not returning any content. Unlike a 204 response, this response requires that the requester reset the document view.", category: "Successful responses" },
  { code: 206, name: "Partial Content", description: "The server is delivering only part of the resource due to a range header sent by the client.", category: "Successful responses" },
  { code: 207, name: "Multi-Status", description: "A Multi-Status response conveys information about multiple resources in situations where multiple status codes might be appropriate.", category: "Successful responses" },
  { code: 208, name: "Already Reported", description: "Used inside a DAV: propstat response element to avoid enumerating the internal members of multiple bindings to the same collection repeatedly.", category: "Successful responses" },
  { code: 226, name: "IM Used", description: "The server has fulfilled a GET request for the resource, and the response is a representation of the result of one or more instance-manipulations applied to the current instance.", category: "Successful responses" },
  { code: 300, name: "Multiple Choices", description: "The requested resource has multiple representations, each with its own specific location.", category: "Redirection messages" },
  { code: 301, name: "Moved Permanently", description: "The requested resource has been permanently moved to a new URL.", category: "Redirection messages" },
  { code: 302, name: "Found", description: "The requested resource has been temporarily moved to a different URL.", category: "Redirection messages" },
  { code: 303, name: "See Other", description: "The response to the request can be found under a different URL using a GET method.", category: "Redirection messages" },
  { code: 304, name: "Not Modified", description: "The client's cached version of the requested resource is up to date.", category: "Redirection messages" },
  { code: 305, name: "Use Proxy", description: "The requested resource must be accessed through the proxy given by the Location field.", category: "Redirection messages" },
  { code: 306, name: "unused", description: "This response code is no longer used; it is just reserved. It was used in a previous version of the HTTP/1.1 specification.", category: "Redirection messages" },
  { code: 307, name: "Temporary Redirect", description: "The requested resource is temporarily moved to the URL given by the Location header.", category: "Redirection messages" },
  { code: 308, name: "Permanent Redirect", description: "The requested resource has been permanently moved to another URL, and any future references should use the new URL.", category: "Redirection messages" },
  { code: 400, name: "Bad Request", description: "The server cannot process the request due to a client error.", category: "Client error responses" },
  { code: 401, name: "Unauthorized", description: "The request requires user authentication.", category: "Client error responses" },
  { code: 402, name: "Payment Required", description: "Reserved for future use. The original intention was that this code might be used as part of some form of digital cash or micropayment scheme.", category: "Client error responses" },
  { code: 403, name: "Forbidden", description: "The server understood the request but refuses to authorize it.", category: "Client error responses" },
  { code: 404, name: "Not Found", description: "The requested resource could not be found on the server.", category: "Client error responses" },
  { code: 405, name: "Method Not Allowed", description: "The request method is not supported for the requested resource.", category: "Client error responses" },
  { code: 406, name: "Not Acceptable", description: "The requested resource is capable of generating only content not acceptable according to the Accept headers sent in the request.", category: "Client error responses" },
  { code: 407, name: "Proxy Authentication Required", description: "The client must first authenticate itself with the proxy.", category: "Client error responses" },
  { code: 408, name: "Request Timeout", description: "The server timed out waiting for the request.", category: "Client error responses" },
  { code: 409, name: "Conflict", description: "The request could not be completed due to a conflict with the current state of the target resource.", category: "Client error responses" },
  { code: 410, name: "Gone", description: "The requested resource is no longer available and will not be available again.", category: "Client error responses" },
  { code: 411, name: "Length Required", description: "The server refuses to accept the request without a defined Content-Length.", category: "Client error responses" },
  { code: 412, name: "Precondition Failed", description: "The server does not meet one of the preconditions that the requester put on the request.", category: "Client error responses" },
  { code: 413, name: "Payload Too Large", description: "The request is larger than the server is willing or able to process.", category: "Client error responses" },
  { code: 414, name: "URI Too Long", description: "The URI provided was too long for the server to process.", category: "Client error responses" },
  { code: 415, name: "Unsupported Media Type", description: "The request entity has a media type which the server or resource does not support.", category: "Client error responses" },
  { code: 416, name: "Range Not Satisfiable", description: "The client has asked for a portion of the file, but the server cannot supply that portion.", category: "Client error responses" },
  { code: 417, name: "Expectation Failed", description: "The server cannot meet the requirements of the Expect request-header field.", category: "Client error responses" },
  { code: 418, name: "I'm a teapot", description: "Any attempt to brew coffee with a teapot should result in the error code '418 I'm a teapot'.", category: "Client error responses" },
  { code: 421, name: "Misdirected Request", description: "The request was directed at a server that is not able to produce a response.", category: "Client error responses" },
  { code: 422, name: "Unprocessable Content", description: "The request was well-formed but was unable to be followed due to semantic errors.", category: "Client error responses" },
  { code: 423, name: "Locked", description: "The resource that is being accessed is locked.", category: "Client error responses" },
  { code: 424, name: "Failed Dependency", description: "The request failed due to failure of a previous request.", category: "Client error responses" },
  { code: 425, name: "Too Early", description: "Indicates that the server is unwilling to risk processing a request that might be replayed.", category: "Client error responses" },
  { code: 426, name: "Upgrade Required", description: "The server refuses to perform the request using the current protocol but might be willing to do so after the client upgrades to a different protocol.", category: "Client error responses" },
  { code: 428, name: "Precondition Required", description: "The origin server requires the request to be conditional.", category: "Client error responses" },
  { code: 429, name: "Too Many Requests", description: "The user has sent too many requests in a given amount of time.", category: "Client error responses" },
  { code: 431, name: "Request Header Fields Too Large", description: "The server is unwilling to process the request because its header fields are too large.", category: "Client error responses" },
  { code: 451, name: "Unavailable For Legal Reasons", description: "The server is denying access to the resource as a consequence of a legal demand.", category: "Client error responses" },
  { code: 500, name: "Internal Server Error", description: "The server encountered an unexpected condition that prevented it from fulfilling the request.", category: "Server error responses" },
  { code: 501, name: "Not Implemented", description: "The server does not support the functionality required to fulfill the request.", category: "Server error responses" },
  { code: 502, name: "Bad Gateway", description: "The server acting as a gateway or proxy received an invalid response from an upstream server.", category: "Server error responses" },
  { code: 503, name: "Service Unavailable", description: "The server is currently unable to handle the request due to temporary overloading or maintenance.", category: "Server error responses" },
  { code: 504, name: "Gateway Timeout", description: "The server acting as a gateway or proxy did not receive a timely response from an upstream server.", category: "Server error responses" },
  { code: 505, name: "HTTP Version Not Supported", description: "The server does not support the HTTP protocol version used in the request.", category: "Server error responses" },
  { code: 506, name: "Variant Also Negotiates", description: "Transparent content negotiation for the request results in a circular reference.", category: "Server error responses" },
  { code: 507, name: "Insufficient Storage", description: "The server is unable to store the representation needed to complete the request.", category: "Server error responses" },
  { code: 508, name: "Loop Detected", description: "The server detected an infinite loop while processing the request.", category: "Server error responses" },
  { code: 510, name: "Not Extended", description: "Further extensions to the request are required for the server to fulfill it.", category: "Server error responses" },
  { code: 511, name: "Network Authentication Required", description: "The client needs to authenticate to gain network access.", category: "Server error responses" },
]

const getTypeColor = (category: string) => {
  switch (category) {
    case "Information responses": return "bg-blue-500"
    case "Successful responses": return "bg-green-500"
    case "Redirection messages": return "bg-yellow-500"
    case "Client error responses": return "bg-red-500"
    case "Server error responses": return "bg-purple-500"
    default: return "bg-gray-500"
  }
}

export default function Component() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredCodes = statusCodes.filter(status =>
    status.code.toString().includes(searchTerm) ||
    status.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    status.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="flex flex-col h-screen">
      <div className="p-4 bg-background border-b">
        <h1 className="text-2xl font-bold mb-4">HTTP Status Codes</h1>
        <Input
          type="text"
          placeholder="Search status codes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>
      <ScrollArea className="flex-grow">
        <Table>
          <TableHeader className="sticky top-0 bg-background">
            <TableRow>
              <TableHead className="w-[100px]">Code</TableHead>
              <TableHead className="w-[200px]">Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="w-[200px]">Category</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCodes.map((status) => (
              <TableRow key={status.code}>
                <TableCell className="font-medium">{status.code}</TableCell>
                <TableCell>{status.name}</TableCell>
                <TableCell>{status.description}</TableCell>
                <TableCell>
                  <Badge className={`${getTypeColor(status.category)} text-white`}>
                    {status.category}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  )
}