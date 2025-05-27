export const customer = `query getCustomers ($customerIds: [ID!]!){
    nodes(ids: $customerIds) {
    ...on Customer{
      id
      displayname
      email
    }
}
  }`;
console.log("🚀 ~ customer ~ customer:", customer);
 