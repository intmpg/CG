const float M_PI = 3.141592653;
const float STEP = M_PI * 4 / 5;

bool PointIsOnTheLeft(vec2 p0, vec2 p1, vec2 p)
{
    vec2 p0p1 = p1 - p0;
    // find the orthogonal vector to p0p1
    vec2 n = vec2(-p0p1.y, p0p1.x);
    // Find the dot product between n and (p - p0)
    return dot(p - p0, n) > 0.0;
}

bool PointIsInsideTriangle(vec2 p0, vec2 p1, vec2 p2, vec2 p)
{
    return PointIsOnTheLeft(p0, p1, p) &&
           PointIsOnTheLeft(p1, p2, p) &&
           PointIsOnTheLeft(p2, p0, p);
}

bool PointIsInsideSickle(vec2 p, float radius, float coordX, float coordY)
{
	float x = p.x - coordX;
	x *= x;

	float y = p.y - coordY;
	y *= y;
	

	return (x + y) <= (radius * radius);
}

bool PointIsInsideSickleHandle(vec2 p)
{
	vec2 s0 = vec2(0,0.20);
	vec2 s1 = vec2(0.25,0);
	vec2 s2 = vec2(0.78,1.1);
	vec2 s3 = vec2(1,0.9);
	return PointIsOnTheLeft(s0, s1, p) &&
		   PointIsOnTheLeft(s1, s3, p) &&
		   PointIsOnTheLeft(s3, s2, p) &&
		   PointIsOnTheLeft(s2, s0, p) ;
}

vec2 Stroke5PointStar(const vec2 center, float radius, int vertexIndex)
{
    float angle = -0.5;
	float angleShift = 1.85f + STEP * float(vertexIndex);
	float x = center.x + radius * cos(angle * angleShift);
	float y = center.y + radius * sin(angle * angleShift);
    return vec2(x, y);
}

bool PointIsInsideTheHammer(vec2 p)
{
	vec2 s0 = vec2(1.04,1.6);
	vec2 s1 = vec2(1.35,1.35);
	vec2 s2 = vec2(1.75,2.28);
	vec2 s3 = vec2(2.05, 2.35);
	vec2 s4 = vec2(2.23, 2.23);
	return PointIsOnTheLeft(s0, s1, p) &&
			PointIsOnTheLeft(s1, s4, p) &&
			PointIsOnTheLeft(s4, s3, p) &&
            PointIsOnTheLeft(s3, s2, p) &&
		    PointIsOnTheLeft(s2, s0, p);
}

bool PointIsInsideTheHammerHandle(vec2 p)
{
	vec2 s0 = vec2(3.75,0.15);
	vec2 s1 = vec2(4,0.25);
	vec2 s2 = vec2(1.65,1.8);
	vec2 s3 = vec2(1.9,1.9);
	
	return (PointIsOnTheLeft(s0, s1, p) &&
			PointIsOnTheLeft(s1, s3, p) &&
			PointIsOnTheLeft(s3, s2, p) &&
			PointIsOnTheLeft(s2, s0, p));
}

bool PointIsInStar(vec2 pos, vec2 starPoints[5], vec2 starPoints2[5], vec2 center)
{
	return PointIsInsideTriangle(starPoints[0], starPoints[3], center, pos) ||
		   PointIsInsideTriangle(starPoints[1], starPoints[4], center, pos) ||
		   PointIsInsideTriangle(starPoints[2], starPoints[0], center, pos) ||
		   PointIsInsideTriangle(starPoints[3], starPoints[1], center, pos) ||
		   PointIsInsideTriangle(starPoints[4], starPoints[2], center, pos);
}

void main()
{// 0.93f, 0.1f, 0.14f, 1.f 
	const vec4 RED_COLOR = vec4( 0.93f, 0.1f, 0.14f, 1.f );
	const vec4 YELLOW_COLOR = vec4(1.f, 1.f, 0.1f, 1.f);

    vec2 pos = gl_TexCoord[0].xy;
	vec2 starPoints[5];
	vec2 center = vec2(2.f, 3.65f);
    
	for(int index = 0; index < 5; ++index)
    {
       starPoints[index] =  Stroke5PointStar(center, 0.4f, index);                                         
    }
	
	vec2 starPoints2[5]; 
	for(int index = 0; index < 5; ++index)
    {
       starPoints2[index] =  Stroke5PointStar(center, 0.25f, index);                                         
    }

	if ((!(PointIsInStar(pos, starPoints2, starPoints, center)) && PointIsInStar(pos, starPoints, starPoints2, center)) || 
		PointIsInsideTheHammer(pos) || 
		PointIsInsideTheHammerHandle(pos) ||
		PointIsInsideSickleHandle(pos) || 
		(!PointIsInsideSickle(pos, 1.3f, 1.78f, 1.95f) && PointIsInsideSickle(pos, 1.4f, 2.f, 1.8f)))
    {
        gl_FragColor = YELLOW_COLOR;
    }
    else
    {
        gl_FragColor = RED_COLOR;
    } 

}
