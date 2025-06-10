package arious.backend.Auth.Jwt;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.web.filter.OncePerRequestFilter;
import arious.backend.Auth.user.UserService;

import java.io.IOException;

public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private static final Logger logger = LoggerFactory.getLogger(JwtAuthenticationFilter.class);

    private final JwtUtil jwtUtil;
    private final UserService userService;

    public JwtAuthenticationFilter(JwtUtil jwtUtil, UserService userService) {
        this.jwtUtil = jwtUtil;
        this.userService = userService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        String requestURI = request.getRequestURI();
        String method = request.getMethod();
        logger.debug("Processing request: {} {}", method, requestURI);

        // Skip token validation for OPTIONS requests
        if (method.equals("OPTIONS")) {
            filterChain.doFilter(request, response);
            return;
        }

        // Skip auth for public endpoints
        if (isPublicEndpoint(requestURI, method)) {
            filterChain.doFilter(request, response);
            return;
        }

        try {
            String authHeader = request.getHeader("Authorization");
            logger.debug("Authorization header: {}", authHeader);

            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                logger.debug("No JWT token found in request");
                filterChain.doFilter(request, response);
                return;
            }

            String jwt = authHeader.substring(7);
            String email = jwtUtil.getEmailFromToken(jwt);
            logger.debug("Extracted email from token: {}", email);

            if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                UserDetails userDetails = userService.loadUserByUsername(email);
                logger.debug("User loaded: {}, authorities: {}", userDetails.getUsername(), userDetails.getAuthorities());

                if (jwtUtil.validateToken(jwt)) {
                    UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                            userDetails, null, userDetails.getAuthorities());
                    authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                    logger.debug("Authentication set successfully for user: {} with authorities: {}",
                            email, userDetails.getAuthorities());
                } else {
                    logger.warn("Token validation failed for: {}", email);
                }
            }
        } catch (Exception e) {
            logger.error("Authentication error: {}", e.getMessage(), e);
        }

        filterChain.doFilter(request, response);
    }

    private boolean isPublicEndpoint(String requestURI, String method) {
        // Auth endpoints
        if (requestURI.startsWith("/auth/login") ||
                requestURI.startsWith("/auth/register") ||
                requestURI.startsWith("/auth/setup-admin")) {
            return true;
        }

        // Debug and health endpoints
        if (requestURI.startsWith("/debug") ||
                requestURI.startsWith("/api/health") ||
                requestURI.startsWith("/api/test")) {
            return true;
        }





        return false;
    }
}