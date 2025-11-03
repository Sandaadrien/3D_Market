
using backend.Data;
using backend.DTOs;
using backend.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthenticationController(MarketDbContext marketDbContext, IPasswordHasher<Personne> hasher) : ControllerBase
    {
        private readonly MarketDbContext _marketDbContext = marketDbContext;
        private readonly IPasswordHasher<Personne> _hasher = hasher;

        [HttpGet("registration-admin")]
        public async Task<IActionResult> Registration()
        {
            var newUser = new Personne
            {
                Email = "admin@gmail.com",
                IsAdmin = true
            };
            bool exist = await _marketDbContext.Personnes.AnyAsync(u=> newUser.Email == u.Email);
            if (exist)
                return BadRequest(new { message = "admin déjà existant" });

            newUser.MotDePasse = _hasher.HashPassword(newUser, "123456");

            _marketDbContext.Personnes.Add(newUser);
            await _marketDbContext.SaveChangesAsync();

            return Ok(new { message = "Inscription réussie !" });   

        }

        [HttpPost("registration")]
        public async Task<IActionResult> Registration([FromBody] RegistrationDTOs request)
        {
            /* 
                --> request verification 
                (   password != passwordConfirmation 
                    email != null
                )
                --> is user already exist
                --> enregistrement
            */
            if (request.Password != request.PasswordConfirmation)
                return BadRequest(new { message = "Les mots de passe ne correspondent pas." });

            if (string.IsNullOrWhiteSpace(request.Email))
                return BadRequest(new { message = "L'email est requis." });

            var existingUser = await _marketDbContext.Personnes
                .FirstOrDefaultAsync(u => u.Email == request.Email);
            if (existingUser != null)
                return Conflict(new { message = "Un utilisateur avec cet email existe déjà." });

            var newUser = new Personne
            {
                Email = request.Email
            };

            newUser.MotDePasse = _hasher.HashPassword(newUser, request.Password);

            _marketDbContext.Personnes.Add(newUser);
            await _marketDbContext.SaveChangesAsync();

            return Ok(new { message = "Inscription réussie !" });

        }
        
        [HttpPost("login")]
        public async Task<IActionResult> Connexion([FromBody] ConnexionDTOs request)
        {
            /* 
                --> request.user ?? exist
                --> request.motDePasse ?? marina
            */
           var user = await _marketDbContext.Personnes
                .FirstOrDefaultAsync(u => u.Email == request.Email);

            if (user == null)
                return Unauthorized(new { message = "Identifiants incorrects." });

            var result = _hasher.VerifyHashedPassword(user, user.MotDePasse, request.Password);

            if (result == PasswordVerificationResult.Failed)
                return Unauthorized(new { message = "Mot de passe incorrect." });

            return Ok(new
            {
                message = "Connexion réussie !",
                user = new { user.Id, user.Email }
            });
        }
    }
}