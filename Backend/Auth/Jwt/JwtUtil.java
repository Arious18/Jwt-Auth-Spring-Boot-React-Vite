package arious.backend.Auth.Jwt;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import arious.backend.Auth.user.User;
import arious.backend.Auth.user.UserRepository;

import javax.crypto.SecretKey;
import java.util.*;
import java.util.function.Function;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secretString;

    @Value("${jwt.expiration:86400000}")
    private long expiration;

    private final UserRepository userRepository;

    public JwtUtil(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(secretString.getBytes());
    }

    // Generate token with roles included
    public String generateToken(String email) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        Set<String> roles = new HashSet<>();

        if (userOpt.isPresent()) {
            roles = userOpt.get().getRoles();
        }

        // Convert roles to a list for JWT claims
        List<String> rolesList = new ArrayList<>(roles);

        return Jwts.builder()
                .subject(email)
                .claim("roles", rolesList)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getSigningKey(), Jwts.SIG.HS256)
                .compact();
    }

    public String getEmailFromToken(String token) {
        try {
            Claims claims = Jwts.parser()
                    .verifyWith(getSigningKey())
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();
            return claims.getSubject();
        } catch (Exception e) {
            System.err.println("Error extracting email from token: " + e.getMessage());
            return null;
        }
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parser()
                    .verifyWith(getSigningKey())
                    .build()
                    .parseSignedClaims(token);
            return true;
        } catch (ExpiredJwtException e) {
            System.err.println("JWT token is expired: " + e.getMessage());
            return false;
        } catch (JwtException | IllegalArgumentException e) {
            System.err.println("Invalid JWT token: " + e.getMessage());
            return false;
        }
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        try {
            Claims claims = Jwts.parser()
                    .verifyWith(getSigningKey())
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();
            return claimsResolver.apply(claims);
        } catch (Exception e) {
            System.err.println("Error extracting claim: " + e.getMessage());
            return null;
        }
    }

    public Set<String> extractRoles(String token) {
        try {
            Object rolesObj = extractClaim(token, claims -> claims.get("roles"));
            Set<String> roles = new HashSet<>();

            if (rolesObj instanceof List<?>) {
                for (Object role : (List<?>) rolesObj) {
                    if (role instanceof String) {
                        roles.add((String) role);
                    }
                }
            }

            return roles;
        } catch (Exception e) {
            System.err.println("Error extracting roles: " + e.getMessage());
            return new HashSet<>();
        }
    }
}