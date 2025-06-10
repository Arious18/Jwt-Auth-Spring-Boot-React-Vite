package arious.backend.Auth.user;



import arious.backend.Auth.Jwt.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/debug/auth")
public class DebugAuthController {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserService userService;

    @GetMapping("/current")
    public Map<String, Object> getCurrentAuthentication() {
        Map<String, Object> response = new HashMap<>();

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication != null) {
            response.put("authenticated", authentication.isAuthenticated());
            response.put("principal", authentication.getPrincipal());
            response.put("authorities", authentication.getAuthorities());

            if (authentication.getPrincipal() instanceof String) {
                String email = (String) authentication.getPrincipal();
                Optional<User> user = userService.findByEmail(email);
                if (user.isPresent()) {
                    response.put("user", user.get());
                }
            }
        } else {
            response.put("authentication", "null");
        }

        return response;
    }

    @GetMapping("/test-token")
    public Map<String, Object> testToken(String token) {
        Map<String, Object> response = new HashMap<>();

        try {
            boolean isValid = jwtUtil.validateToken(token);
            response.put("valid", isValid);

            if (isValid) {
                String email = jwtUtil.getEmailFromToken(token);
                response.put("email", email);
                response.put("roles", jwtUtil.extractRoles(token));
            }
        } catch (Exception e) {
            response.put("error", e.getMessage());
        }

        return response;
    }
}