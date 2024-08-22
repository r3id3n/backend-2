import passport from "passport";
import jwt from "passport-jwt";

const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;

const initPassport = () => {
    const cookieExtractor = req => {
        let token = null;
        if (req && req.cookies) {
            token = req.cookies["CookieToken"];
        }
        return token;
    }
    passport.use("jwt", new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: "Aniwear"
    }, async(jwt_playload, done) => {
        try {
            return done(null, jwt_playload);
        } catch (error) {
            return done(error);
        }
    }))
}

export default initPassport;