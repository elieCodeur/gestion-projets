package com.example.gestionprojets.entity;

import jakarta.persistence.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;
import java.util.Set; // Importer Set

@Entity
@Table(name = "users")
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String firstname;
    private String lastname;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "role_id")
    private Role role;

    @OneToMany(mappedBy = "assignedUser")
    private Set<Task> assignedTasks; // Utiliser Set

    @OneToMany(mappedBy = "sender", cascade = CascadeType.ALL)
    private Set<Message> sentMessages; // Utiliser Set

    @OneToMany(mappedBy = "receiver", cascade = CascadeType.ALL)
    private Set<Message> receivedMessages; // Utiliser Set

    // Constructeurs
    public User() {}

    // Getters
    public Long getId() { return id; }
    public String getFirstname() { return firstname; }
    public String getLastname() { return lastname; }
    public String getEmail() { return email; }
    public Role getRole() { return role; }
    public Set<Task> getAssignedTasks() { return assignedTasks; } // Utiliser Set
    public Set<Message> getSentMessages() { return sentMessages; } // Utiliser Set
    public Set<Message> getReceivedMessages() { return receivedMessages; } // Utiliser Set

    // Setters
    public void setId(Long id) { this.id = id; }
    public void setFirstname(String firstname) { this.firstname = firstname; }
    public void setLastname(String lastname) { this.lastname = lastname; }
    public void setEmail(String email) { this.email = email; }
    public void setPassword(String password) { this.password = password; }
    public void setRole(Role role) { this.role = role; }
    public void setAssignedTasks(Set<Task> assignedTasks) { this.assignedTasks = assignedTasks; } // Utiliser Set
    public void setSentMessages(Set<Message> sentMessages) { this.sentMessages = sentMessages; } // Utiliser Set
    public void setReceivedMessages(Set<Message> receivedMessages) { this.receivedMessages = receivedMessages; } // Utiliser Set

    // UserDetails methods
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(role.getName()));
    }

    @Override
    public String getPassword() {
        return password;
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
