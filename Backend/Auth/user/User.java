package arious.backend.Auth.user;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Collection;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Document(collection = "users")
@Data
public class User implements UserDetails {
    @Id
    private String id;

    @Indexed
    private String name;
    private String surname;

    @Indexed(unique = true)
    private String email;

    private String password;
    private LocalDate dateOfBirth;
    private String phoneNumber;
    private String address;
    private String nationality;
    private String gender;
    private String profilePicture;
    private String bio;

    private Set<String> roles = new HashSet<>();
    private LocalDateTime createdDate = LocalDateTime.now();

    public User() {
        if (this.roles == null) {
            this.roles = new HashSet<>();
        }
        if (this.roles.isEmpty()) {
            this.roles.add("USER");
        }
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // Convert each role to a SimpleGrantedAuthority with "ROLE_" prefix
        return roles.stream()
                .map(role -> new SimpleGrantedAuthority(role.startsWith("ROLE_") ? role : "ROLE_" + role))
                .collect(Collectors.toSet());
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() { return true; }
    @Override
    public boolean isAccountNonLocked() { return true; }
    @Override
    public boolean isCredentialsNonExpired() { return true; }
    @Override
    public boolean isEnabled() { return true; }
}