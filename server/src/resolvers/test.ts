import { Query, Resolver } from "type-graphql";

@Resolver()
export class testResolver {
    @Query(() => String)
    test() {
        return "Welcome test"
    }
}